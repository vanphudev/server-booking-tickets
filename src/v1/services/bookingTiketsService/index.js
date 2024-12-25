"use strict";
const __RESPONSE = require("../../core");
const db = require("../../models");
const {validationResult} = require("express-validator");
const {QueryTypes} = require("sequelize");
const crypto = require("crypto");
const redis = require("../../configs/redis");
const moment = require("moment");
const sendVoucher = require("../../utils/sendVoucher");
const sendEmail = require("../../utils/sendEmail");

const BOOKING_EXPIRE_TIME = 20 * 60; // 20 phút tính bằng giây

// Hàm kiểm tra ghế đã được đặt trong Redis
const checkSeatsAvailability = async (seats, tripId) => {
   const unavailableSeats = [];

   for (const seat of seats) {
      const seatKey = `seat:${tripId}:${seat?.seat_id}`;
      const seatInfo = await redis.get(seatKey);

      if (seatInfo) {
         const parsedInfo = JSON.parse(seatInfo);
         unavailableSeats.push({
            seat_id: seat?.seat_id,
            seat_name: seat?.seat_name,
            booked_by: parsedInfo?.customer_name,
            expires_at: parsedInfo?.expire_time,
         });
      }
   }

   return unavailableSeats;
};

// Hàm t��o mã ticket ngẫu nhiên
const generateTicketCode = () => {
   const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
   let code = "";
   for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
   }
   return code;
};

const createBookingTickets = async (bookingData) => {
   if (!bookingData.customer_info?.userId && !bookingData.customer_info.name) {
      throw new __RESPONSE.BadRequestError({
         message: "Tên khách hàng không hợp lệ",
         suggestion: "Vui lòng nhập tên khách hàng",
         error_code: "INVALID_CUSTOMER_NAME",
      });
   }
   if (!bookingData.customer_info?.userId && !bookingData.customer_info.email) {
      throw new __RESPONSE.BadRequestError({
         message: "Email khách hàng không hợp lệ",
         suggestion: "Vui lòng nhập email khách hàng",
         error_code: "INVALID_CUSTOMER_EMAIL",
      });
   }
   if (!bookingData.customer_info?.userId && !bookingData.customer_info.phone) {
      throw new __RESPONSE.BadRequestError({
         message: "Số điện thoại khách hàng không hợp lệ",
         suggestion: "Vui lòng nhập số điện thoại khách hàng",
         error_code: "INVALID_CUSTOMER_PHONE",
      });
   }
   if (!bookingData.seats || bookingData.seats.length === 0) {
      throw new __RESPONSE.BadRequestError({
         message: "Danh sách ghế không hợp lệ",
         suggestion: "Vui lòng chọn ít nhất một ghế",
         error_code: "INVALID_SEAT_LIST",
      });
   }
   if (!bookingData.trip_id) {
      throw new __RESPONSE.BadRequestError({
         message: "ID chuyến đi không hợp lệ",
         suggestion: "Vui lòng nhập ID chuyến đi",
         error_code: "INVALID_TRIP_ID",
      });
   }
   if (!bookingData.booking_session) {
      throw new __RESPONSE.BadRequestError({
         message: "Phiên đặt vé không hợp lệ",
         suggestion: "Vui lòng nhập phiên đặt vé",
         error_code: "INVALID_BOOKING_SESSION",
      });
   }
   if (!bookingData.pickup_info || !bookingData.dropoff_info) {
      throw new __RESPONSE.BadRequestError({
         message: "Thông tin điểm đón/điểm trả không hợp lệ",
         suggestion: "Vui lòng nhập điểm đón/điểm trả",
         error_code: "INVALID_PICKUP_DROPFF_INFO",
      });
   }

   // Kiểm tra ghế trước khi đặt
   const unavailableSeats = await checkSeatsAvailability(bookingData?.seats, bookingData?.trip_id);
   if (unavailableSeats.length > 0) {
      const unavailableSeatsInfo = unavailableSeats
         .map(
            (seat) =>
               `Ghế ${seat?.seat_name} đang được đặt bởi ${seat?.booked_by} (hết hạn lúc ${new Date(
                  seat?.expires_at
               ).toLocaleString()})`
         )
         .join(", \n");

      throw new __RESPONSE.BadRequestError({
         message: `Không thể đặt vé: ${unavailableSeatsInfo}`,
         suggestion: "Vui lòng chọn ghế khác",
         error_code: "UNAVAILABLE_SEATS",
      });
   }

   const t = await db.sequelize.transaction();
   try {
      const bookingExpirationTime = new Date();
      bookingExpirationTime.setMinutes(bookingExpirationTime.getMinutes() + 15);

      // Tạo booking_tickets
      const bookingTicket = await db.BookingTicket.create(
         {
            booking_code: generateBookingCode(),
            booking_status: "pending",
            booking_channel: "website",
            booking_number_of_ticket: bookingData?.seats?.length,
            booking_total_price: bookingData?.total_amount,
            booking_total_payment: bookingData?.total_amount,
            booking_session: bookingData?.booking_session,
            customer_id: bookingData?.customer_info?.userId || null,
            guest_fullname: !bookingData?.customer_info?.userId ? bookingData?.customer_info?.name : null,
            guest_email: !bookingData?.customer_info?.userId ? bookingData?.customer_info?.email : null,
            guest_phone: !bookingData?.customer_info?.userId ? bookingData?.customer_info?.phone : null,
            office_pickup_id:
               bookingData?.pickup_info?.type === "dropoff" || bookingData?.pickup_info?.type === "pickup"
                  ? bookingData?.pickup_info?.location
                  : null,
            office_dropoff_id:
               bookingData?.dropoff_info?.type === "dropoff" || bookingData?.dropoff_info?.type === "pickup"
                  ? bookingData?.dropoff_info?.location
                  : null,
            transfer_point_name:
               bookingData?.pickup_info?.type === "shuttle" ? bookingData?.pickup_info?.location : null,
            return_point_name:
               bookingData?.dropoff_info?.type === "shuttle" ? bookingData?.dropoff_info?.location : null,
            booking_expiration_time: bookingExpirationTime,
         },
         {transaction: t}
      );

      // Xử lý từng ghế và tạo tickets
      const ticketPromises = bookingData.seats.map(async (seat) => {
         const ticket = await db.Ticket.create(
            {
               booking_seat_id: seat?.seat_id,
               ticket_name_chair: seat?.seat_name,
               ticket_amount: seat?.price,
               is_export_ticket: 0,
               ticket_code: generateTicketCode(),
            },
            {transaction: t}
         );

         // Tạo booking_ticket_details
         await db.BookingTicketDetail.create(
            {
               booking_id: bookingTicket.booking_id,
               ticket_id: ticket.ticket_id,
               price: seat?.price,
            },
            {transaction: t}
         );

         // Lưu thông tin ghế vào Redis
         const seatKey = `seat:${bookingData?.trip_id}:${seat?.seat_id}`;
         const expireTime = Date.now() + BOOKING_EXPIRE_TIME * 1000;
         const seatInfo = {
            booking_id: bookingTicket.booking_id,
            customer_name: bookingData?.customer_info?.name,
            expire_time: expireTime,
         };
         await redis.setex(seatKey, BOOKING_EXPIRE_TIME, JSON.stringify(seatInfo));
         return ticket;
      });

      await Promise.all(ticketPromises);
      await t.commit();

      // Lưu thông tin booking vào Redis
      const bookingInfo = {
         booking_id: bookingTicket.booking_id,
         seats: bookingData.seats,
         expire_time: Date.now() + BOOKING_EXPIRE_TIME * 1000,
         status: "waiting_payment",
         customer_name: bookingData?.customer_info?.name,
      };

      return {
         success: true,
         message: "Đã lưu thông tin đặt vé, vui lòng thanh toán trong vòng 15 phút",
         data: {
            phone: bookingData?.customer_info?.phone,
            email: bookingData?.customer_info?.email,
            name: bookingData?.customer_info?.name,
            seats: bookingData?.seats,
            trip_id: bookingData?.trip_id,
            pickup_info: bookingData?.pickup_info,
            dropoff_info: bookingData?.dropoff_info,
            total_amount: bookingData?.total_amount,
            booking_id: bookingTicket.booking_id,
            booking_code: bookingTicket.booking_code,
            expire_time: bookingInfo.expire_time,
            booking_session: bookingData?.booking_session,
            payment_deadline: bookingExpirationTime,
         },
      };
   } catch (error) {
      await t.rollback();
      throw new __RESPONSE.BadRequestError({
         message: "Đã có lỗi xảy ra " + error,
         suggestion: "Vui lòng thử lại sau",
         error_code: "BOOKING_TICKETS_ERROR",
      });
   }
};

// Hàm tạo mã booking
const generateBookingCode = () => {
   const timestamp = Date.now().toString();
   const randomBytes = crypto.randomBytes(4).toString("hex").toUpperCase();
   return `BOOK${timestamp}${randomBytes}`;
};

const checkBookingStatus = async (bookingSession) => {
   const bookingInfo = await redis.get(`booking:${bookingSession}`);
   if (!bookingInfo) {
      return {
         success: false,
         message: "Phiên đặt vé đã hết hạn hoặc không tồn tại",
      };
   }
   return {
      success: true,
      data: JSON.parse(bookingInfo),
   };
};

// Thêm hàm helper để tính điểm thưởng dựa trên giá trị hóa đơn
const calculateBonusPoints = (amount) => {
   if (amount >= 3000000) return 300; // Hóa đơn >= 3tr: 300 điểm
   if (amount >= 2000000) return 200; // Hóa đơn >= 2tr: 200 điểm
   if (amount >= 1000000) return 100; // Hóa đơn >= 1tr: 100 điểm
   if (amount >= 800000) return 80; // Hóa đơn >= 800k: 80 điểm
   if (amount >= 600000) return 60; // Hóa đơn >= 600k: 60 điểm
   if (amount >= 400000) return 40; // Hóa đơn >= 400k: 40 điểm
   if (amount >= 300000) return 30; // Hóa đơn >= 300k: 30 điểm
   if (amount >= 200000) return 20; // Hóa đơn >= 200k: 20 điểm
   return 10; // Hóa đơn < 200k: 10 điểm
};

const generateRandomCode = () => {
   return Math.floor(1000 + Math.random() * 9000).toString();
};

const updateBookingAfterPaymentVNPay = async (req) => {
   let {vnp_Params, paymentMethod} = req.body;
   if (!vnp_Params || !paymentMethod) {
      throw new __RESPONSE.BadRequestError({
         message: "Thông tin thanh toán không hợp lệ",
         error_code: "INVALID_PAYMENT_INFO",
      });
   }
   let secureHash = vnp_Params["vnp_SecureHash"];
   let orderId = vnp_Params["vnp_TxnRef"];
   let rspCode = vnp_Params["vnp_ResponseCode"];
   let amount = vnp_Params["vnp_Amount"] / 100;
   delete vnp_Params["vnp_SecureHash"];
   delete vnp_Params["vnp_SecureHashType"];
   vnp_Params = sortObject(vnp_Params);
   let secretKey = "BNWKL2QUOSCH35A6XRG0MA4HGX9PIQ7E";
   let querystring = require("qs");
   let signData = querystring.stringify(vnp_Params, {encode: false});
   let crypto = require("crypto");
   let hmac = crypto.createHmac("sha512", secretKey);
   let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
   const booking = await db.BookingTicket.findOne({
      where: {
         booking_code: orderId,
         booking_status: "pending",
         payment_status: "pending",
         booking_expiration_time: {
            [db.Sequelize.Op.gt]: new Date(),
         },
      },
      attributes: {
         exclude: ["office_id"],
      },
   });

   if (!booking) {
      throw new __RESPONSE.NotFoundError({
         message: "Không tìm thấy thông tin đặt vé",
         error_code: "BOOKING_NOT_FOUND",
      });
   }

   // if (Number(booking.booking_total_payment) !== Number(amount) + Number(booking.discount_amount || 0)) {
   //    throw new __RESPONSE.BadRequestError({
   //       message: "Số tiền không hợp lệ",
   //       error_code: "INVALID_AMOUNT",
   //    });
   // }

   if (secureHash === signed) {
      const t = await db.sequelize.transaction();
      try {
         // Lấy thông tin chi tiết booking và ghế đã đặt
         const bookingDetails = await db.BookingTicketDetail.findAll({
            where: {
               booking_id: booking.booking_id,
            },
            include: [
               {
                  model: db.Ticket,
                  as: "bookingTicketDetail_belongto_ticket",
                  attributes: ["booking_seat_id"],
               },
            ],
            transaction: t,
         });

         if (rspCode === "00") {
            // Cập nhật trạng thái booking
            await booking.update(
               {
                  booking_status: "confirmed",
                  payment_status: "completed",
                  payment_method_id: paymentMethod === "vnpay" ? 1 : null,
                  payment_time: new Date(),
                  payment_amount: amount,
                  payment_transaction_id: orderId,
                  discount_amount: booking.discount_amount || null,
                  booking_total_price: amount,
                  // booking_total_payment: amount,
               },
               {transaction: t}
            );

            if (booking.voucher_id) {
               await db.Voucher.update(
                  {
                     voucher_usage_limit: db.sequelize.literal(`voucher_usage_limit - 1`),
                  },
                  {
                     where: {
                        voucher_id: booking.voucher_id,
                     },
                  },
                  {transaction: t}
               );
            }

            if (booking.customer_id) {
               const customer = await db.Customer.findByPk(booking.customer_id);
               if (customer) {
                  const bonusPoints = calculateBonusPoints(Number(amount) + Number(booking.discount_amount || 0));
                  await db.Customer.update(
                     {
                        bonus_point: db.sequelize.literal(`bonus_point + ${bonusPoints}`),
                     },
                     {
                        where: {customer_id: booking.customer_id},
                     }
                  );

                  const updatedCustomer = await db.Customer.findByPk(booking.customer_id);
                  const currentPoints = updatedCustomer.bonus_point;

                  if (currentPoints >= 130) {
                     const timestamp = moment().format("YYYYMMDDHHmmssSSS");
                     const randomCode = generateRandomCode();
                     const voucher30 = await db.Voucher.create({
                        voucher_code: `LOYAL30_${timestamp}_${randomCode}`,
                        voucher_discount_percentage: 30,
                        voucher_discount_max_amount: 0,
                        voucher_usage_limit: 1,
                        voucher_valid_from: new Date(),
                        voucher_valid_to: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Hết hạn sau 30 ngày
                     });

                     await db.VoucherCustomer.create({
                        voucher_id: voucher30.voucher_id,
                        customer_id: booking.customer_id,
                     });

                     await sendVoucher({
                        to: customer?.customer_email,
                        subject: `[FUTA Bus Lines] - Kết nối với chúng tôi - Khuyến mãi đặc biệt dành cho Anh/chị ${customer?.customer_full_name}`,
                        template: "voucher",
                        context: {
                           ap_dung: "Khách hàng thanh toán đơn hàng",
                           name_voucher: "Khuyến mãi đặc biệt",
                           customerName: customer?.customer_full_name,
                           voucherCode: voucher30.voucher_code,
                           voucherDiscount: `${voucher30?.voucher_discount_percentage.toFixed(2)}`,
                           voucherSDate: voucher30.voucher_valid_from.toLocaleDateString("vi-VN", {
                              weekday: "long",
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                           }),
                           voucherEDate: voucher30.voucher_valid_to.toLocaleDateString("vi-VN", {
                              weekday: "long",
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                           }),
                        },
                     });

                     await db.Customer.update(
                        {
                           bonus_point: 0,
                        },
                        {
                           where: {customer_id: booking.customer_id},
                        }
                     );
                  } else if (currentPoints >= 60) {
                     const timestamp = moment().format("YYYYMMDDHHmmssSSS");
                     const randomCode = generateRandomCode();
                     const voucher25 = await db.Voucher.create({
                        voucher_code: `LOYAL25_${timestamp}_${randomCode}`,
                        voucher_discount_percentage: 25,
                        voucher_discount_max_amount: 0,
                        voucher_usage_limit: 1,
                        voucher_valid_from: new Date(),
                        voucher_valid_to: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                     });

                     await db.VoucherCustomer.create({
                        voucher_id: voucher25.voucher_id,
                        customer_id: booking.customer_id,
                     });

                     await sendVoucher({
                        to: customer?.customer_email,
                        subject: `[FUTA Bus Lines] - Kết nối với chúng tôi - Khuyến mãi đặc biệt dành cho Anh/chị ${customer?.customer_full_name}`,
                        template: "voucher",
                        context: {
                           ap_dung: "Khách hàng thanh toán đơn hàng",
                           name_voucher: "Khuyến mãi đặc biệt",
                           customerName: customer?.customer_full_name,
                           voucherCode: voucher25.voucher_code,
                           voucherDiscount: `${voucher25?.voucher_discount_percentage.toFixed(2)}`,
                           voucherSDate: voucher25.voucher_valid_from.toLocaleDateString("vi-VN", {
                              weekday: "long",
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                           }),
                           voucherEDate: voucher25.voucher_valid_to.toLocaleDateString("vi-VN", {
                              weekday: "long",
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                           }),
                        },
                     });

                     await db.Customer.update(
                        {
                           bonus_point: 0,
                        },
                        {
                           where: {customer_id: booking.customer_id},
                        }
                     );
                  } else if (currentPoints >= 10) {
                     const timestamp = moment().format("YYYYMMDDHHmmssSSS");
                     const randomCode = generateRandomCode();
                     const voucher10 = await db.Voucher.create({
                        voucher_code: `LOYAL10_${timestamp}_${randomCode}`,
                        voucher_discount_percentage: 10,
                        voucher_discount_max_amount: 0,
                        voucher_usage_limit: 1,
                        voucher_valid_from: new Date(),
                        voucher_valid_to: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                     });

                     await db.VoucherCustomer.create({
                        voucher_id: voucher10.voucher_id,
                        customer_id: booking.customer_id,
                     });

                     await sendVoucher({
                        to: customer?.customer_email,
                        subject: `[FUTA Bus Lines] - Kết nối với chúng tôi - Khuyến mãi đặc biệt dành cho Anh/chị ${customer?.customer_full_name}`,
                        template: "voucher",
                        context: {
                           ap_dung: "Khách hàng thanh toán đơn hàng",
                           name_voucher: "Khuyến mãi đặc biệt",
                           customerName: customer?.customer_full_name,
                           voucherCode: voucher10.voucher_code,
                           voucherDiscount: `${voucher10?.voucher_discount_percentage.toFixed(2)}`,
                           voucherSDate: voucher10.voucher_valid_from.toLocaleDateString("vi-VN", {
                              weekday: "long",
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                           }),
                           voucherEDate: voucher10.voucher_valid_to.toLocaleDateString("vi-VN", {
                              weekday: "long",
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                           }),
                        },
                     });

                     await db.Customer.update(
                        {
                           bonus_point: 0,
                        },
                        {
                           where: {customer_id: booking.customer_id},
                        }
                     );
                  }
               }
            }

            for (const detail of bookingDetails) {
               await db.BookingSeat.update(
                  {
                     booking_seat_status: 1, // Đã được đặt
                     booking_expiration_time: null, // Xóa thời gian hết hạn vì đã thanh toán
                  },
                  {
                     where: {
                        booking_seat_id: detail?.bookingTicketDetail_belongto_ticket?.booking_seat_id,
                     },
                     transaction: t,
                  }
               );
            }

            await t.commit();

            return {
               success: true,
               message: "Thanh toán thành công",
               booking_code: booking.booking_code,
            };
         } else {
            // Xử lý khi thanh toán thất bại
            await booking.update(
               {
                  booking_status: "cancelled",
                  payment_status: "failed",
                  payment_method_id: paymentMethod === "vnpay" ? 1 : null,
                  payment_time: new Date(),
               },
               {transaction: t}
            );

            // Giải phóng các ghế đã đặt
            for (const detail of bookingDetails) {
               await db.BookingSeat.update(
                  {
                     booking_seat_status: 0,
                     is_locked: 0,
                  },
                  {
                     where: {
                        booking_seat_id: detail.Ticket.booking_seat_id,
                     },
                     transaction: t,
                  }
               );
            }

            await t.commit();
            throw new __RESPONSE.BadRequestError({
               message: "Thanh toán thất bại",
               error_code: "PAYMENT_FAILED",
            });
         }
      } catch (error) {
         await t.rollback();
         throw new __RESPONSE.BadRequestError({
            message: "Lỗi cập nhật thanh toán: " + error.message,
            error_code: "PAYMENT_UPDATE_ERROR",
         });
      }
   } else {
      throw new __RESPONSE.BadRequestError({
         message: "Chữ ký không hợp lệ",
         error_code: "INVALID_SIGNATURE",
      });
   }
};

// Xử ý lấy url thanh toán VNPay.
const getPaymenVNPaytUrl = async (req) => {
   process.env.TZ = "Asia/Ho_Chi_Minh";

   let tmnCode = "9NU30K5Z";
   let secretKey = "BNWKL2QUOSCH35A6XRG0MA4HGX9PIQ7E";
   let vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
   let returnUrl = "https://futa.vanphudev.id.vn/thanh-toan-thanh-cong";

   let date = new Date();
   let createDate = moment(date).format("YYYYMMDDHHmmss");

   const booking = await db.BookingTicket.findOne({
      where: {
         booking_code: req.query.bookingId,
         booking_status: "pending",
         payment_status: "pending",
         booking_expiration_time: {
            [db.Sequelize.Op.gt]: new Date(),
         },
      },
      attributes: {
         exclude: ["office_id"],
      },
   });

   if (!booking) {
      throw new __RESPONSE.NotFoundError({
         message: "Không tìm thấy thông tin đặt vé hoặc đã hết hạn",
         error_code: "BOOKING_NOT_FOUND",
      });
   }

   let ipAddr = req.ip || "127.0.0.1";

   let orderId = `${req.query.bookingId}`;
   let amount = booking.booking_total_payment - (booking.discount_amount || 0);

   let locale = "vn";
   let currCode = "VND";

   let vnp_Params = {};
   vnp_Params["vnp_Version"] = "2.1.0";
   vnp_Params["vnp_Command"] = "pay";
   vnp_Params["vnp_TmnCode"] = tmnCode;
   vnp_Params["vnp_Locale"] = locale;
   vnp_Params["vnp_CurrCode"] = currCode;
   vnp_Params["vnp_TxnRef"] = orderId;
   vnp_Params["vnp_OrderInfo"] = `FUTA Bus Lines - Thanh toan ve xe cho booking ${req.query.bookingId}`;
   vnp_Params["vnp_OrderType"] = "billpayment";
   vnp_Params["vnp_Amount"] = amount * 100;
   vnp_Params["vnp_ReturnUrl"] = returnUrl;
   vnp_Params["vnp_IpAddr"] = ipAddr;
   vnp_Params["vnp_CreateDate"] = createDate;
   vnp_Params["vnp_ExpireDate"] = moment(booking.booking_expiration_time).format("yyyyMMDDHHmmss");

   vnp_Params = sortObject(vnp_Params);

   let querystring = require("qs");
   let signData = querystring.stringify(vnp_Params, {encode: false});
   let hmac = crypto.createHmac("sha512", secretKey);
   let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
   vnp_Params["vnp_SecureHash"] = signed;

   const paymentUrl = vnpUrl + "?" + querystring.stringify(vnp_Params, {encode: false});

   return {
      success: true,
      data: {
         payment_url: paymentUrl,
         order_id: orderId,
         amount: amount,
         booking_id: req.query.bookingId,
      },
   };
};

const getBookingDetailsByCode = async (bookingCode) => {
   console.log(bookingCode);
   try {
      const query = `
         SELECT 
         bt.*,
         c.customer_full_name, c.customer_phone, c.customer_email,
         t.*,
         w.way_id, w.way_name,
         v.vehicle_license_plate,
         vt.vehicle_type_name,
         origin_office.office_name as origin_office_name,
         destination_office.office_name as destination_office_name,
         
         -- Thông tin điểm đón/trả
         pickup.province_id as pickup_province_id,
         pickup.province_name as pickup_province_name,
         pickup_ward.ward_name as pickup_ward_name,
         pickup_district.district_name as pickup_district_name,
         pickup_office.office_name as pickup_office_name,
         pickup_office.office_address as pickup_office_address,
         
         dropoff.province_id as dropoff_province_id,
         dropoff.province_name as dropoff_province_name,
         dropoff_ward.ward_name as dropoff_ward_name,
         dropoff_district.district_name as dropoff_district_name,
         dropoff_office.office_name as dropoff_office_name,
         dropoff_office.office_address as dropoff_office_address,
         
         -- Thông tin ghế đã đặt
         JSON_ARRAYAGG(
            JSON_OBJECT(
                  'seat_id', bs.booking_seat_id,
                  'seat_name', bs.seat_name,
                  'seat_price', tk.ticket_amount
            )
         ) as booked_seats
         
      FROM booking_tickets bt
      -- Join với bảng customers (nếu là khách hàng đã đăng ký)
      LEFT JOIN customers c ON bt.customer_id = c.customer_id

      -- Join để lấy thông tin vé và ghế
      INNER JOIN booking_ticket_details btd ON bt.booking_id = btd.booking_id
      INNER JOIN tickets tk ON btd.ticket_id = tk.ticket_id
      INNER JOIN booking_seats bs ON tk.booking_seat_id = bs.booking_seat_id

      -- Join để lấy thông tin chuyến đi
      INNER JOIN trips t ON bs.trip_id = t.trip_id
      INNER JOIN routes r ON t.route_id = r.route_id
      INNER JOIN ways w ON r.way_id = w.way_id
      INNER JOIN offices origin_office ON origin_office.office_id = r.origin_office_id
      INNER JOIN offices destination_office ON destination_office.office_id = r.destination_office_id

      -- Join để lấy thông tin xe
      INNER JOIN vehicles v ON t.vehicle_id = v.vehicle_id
      INNER JOIN map_vehicle_layouts mvl ON v.map_vehicle_layout_id = mvl.map_vehicle_layout_id
      INNER JOIN vehicle_types vt ON mvl.vehicle_type_id = vt.vehicle_type_id

      -- Điểm đón
      LEFT JOIN offices pickup_office ON bt.office_pickup_id = pickup_office.office_id
      LEFT JOIN wards pickup_ward ON pickup_office.ward_id = pickup_ward.ward_id
      LEFT JOIN districts pickup_district ON pickup_ward.district_id = pickup_district.district_id
      LEFT JOIN provinces pickup ON pickup_district.province_id = pickup.province_id

      -- Điểm trả
      LEFT JOIN offices dropoff_office ON bt.office_dropoff_id = dropoff_office.office_id
      LEFT JOIN wards dropoff_ward ON dropoff_office.ward_id = dropoff_ward.ward_id
      LEFT JOIN districts dropoff_district ON dropoff_ward.district_id = dropoff_district.district_id
      LEFT JOIN provinces dropoff ON dropoff_district.province_id = dropoff.province_id

      WHERE bt.booking_code = :bookingCode
         AND bt.booking_status = 'pending'
         AND bt.payment_status = 'pending'
         AND bt.booking_expiration_time > NOW()
         AND bt.deleted_at IS NULL
      GROUP BY 
         bt.booking_id,
         t.trip_id,
         w.way_id,
         v.vehicle_license_plate,
         vt.vehicle_type_name,
         pickup.province_id,
         dropoff.province_id
      `;

      const bookingDetails = await db.sequelize.query(query, {
         replacements: {bookingCode},
         type: QueryTypes.SELECT,
      });

      if (!bookingDetails || bookingDetails.length === 0) {
         throw new __RESPONSE.NotFoundError({
            message: "Không tìm thấy thông tin đặt vé",
            error_code: "BOOKING_NOT_FOUND",
         });
      }

      // Sửa phần này
      const booking = bookingDetails[0];
      let parsedSeats = [];

      // Kiểm tra và parse booked_seats nếu là string
      if (booking.booked_seats) {
         try {
            parsedSeats =
               typeof booking.booked_seats === "string" ? JSON.parse(booking.booked_seats) : booking.booked_seats;
         } catch (error) {
            console.error("Error parsing booked_seats:", error);
            parsedSeats = [];
         }
      }

      return {
         success: true,
         data: {
            booking_info: {
               booking_id: booking.booking_id,
               booking_code: booking.booking_code,
               booking_status: booking.booking_status,
               total_tickets: booking.booking_number_of_ticket,
               total_price: booking.booking_total_price,
               total_payment: booking.booking_total_payment,
               expiration_time: booking.booking_expiration_time,
               voucher_id: booking.voucher_id || null,
               discount_amount: booking.discount_amount || null,
            },
            customer_info: {
               name: booking.customer_full_name || booking.guest_fullname,
               phone: booking.customer_phone || booking.guest_phone,
               email: booking.customer_email || booking.guest_email,
            },
            trip_info: {
               trip_id: booking.trip_id,
               trip_price: booking.trip_price,
               trip_date: booking.trip_date,
               departure_time: booking.trip_departure_time,
               arrival_time: booking.trip_arrival_time,
               way_name: booking.way_name,
               trip_discount: booking.trip_discount,
               origin_office_name: booking.origin_office_name,
               destination_office_name: booking.destination_office_name,
               vehicle: {
                  license_plate: booking.vehicle_license_plate,
                  type: booking.vehicle_type_name,
               },
            },
            location_info: {
               pickup: {
                  province_id: booking.pickup_province_id,
                  province_name: booking.pickup_province_name,
                  district_name: booking.pickup_district_name,
                  ward_name: booking.pickup_ward_name,
                  office_name: booking.pickup_office_name,
                  office_address: booking.pickup_office_address,
               },
               dropoff: {
                  province_id: booking.dropoff_province_id,
                  province_name: booking.dropoff_province_name,
                  district_name: booking.dropoff_district_name,
                  ward_name: booking.dropoff_ward_name,
                  office_name: booking.dropoff_office_name,
                  office_address: booking.dropoff_office_address,
               },
            },
            seats: parsedSeats,
            tickets: booking.tickets_detail
               ? typeof booking.tickets_detail === "string"
                  ? JSON.parse(booking.tickets_detail)
                  : booking.tickets_detail
               : [],
         },
      };
   } catch (error) {
      if (error instanceof __RESPONSE.NotFoundError) {
         throw error;
      }
      throw new __RESPONSE.BadRequestError({
         message: "Đã có lỗi xảy ra khi lấy thông tin đặt vé " + error.message,
         error_code: "GET_BOOKING_DETAILS_ERROR",
      });
   }
};

const getInfoBookingTiketsSuccess = async (bookingCode) => {
   console.log(bookingCode);
   try {
      const query = `
         SELECT 
         bt.*,
         c.customer_full_name, c.customer_phone, c.customer_email,
         t.*,
         w.way_id, w.way_name,
         v.vehicle_license_plate,
         vt.vehicle_type_name,
         origin_office.office_name as origin_office_name,
         destination_office.office_name as destination_office_name,
         
         -- Thông tin điểm đón/trả
         pickup.province_id as pickup_province_id,
         pickup.province_name as pickup_province_name,
         pickup_ward.ward_name as pickup_ward_name,
         pickup_district.district_name as pickup_district_name,
         pickup_office.office_name as pickup_office_name,
         pickup_office.office_address as pickup_office_address,
         
         dropoff.province_id as dropoff_province_id,
         dropoff.province_name as dropoff_province_name,
         dropoff_ward.ward_name as dropoff_ward_name,
         dropoff_district.district_name as dropoff_district_name,
         dropoff_office.office_name as dropoff_office_name,
         dropoff_office.office_address as dropoff_office_address,
         
         -- Thông tin ghế đã đặt
         JSON_ARRAYAGG(
            JSON_OBJECT(
                  'seat_id', bs.booking_seat_id,
                  'seat_name', bs.seat_name,
                  'seat_price', tk.ticket_amount
            )
         ) as booked_seats,
         
         -- Thông tin vé chi tiết
         JSON_ARRAYAGG(
            JSON_OBJECT(
                  'ticket_id', tk.ticket_id,
                  'ticket_code', tk.ticket_code,
                  'seat_name', bs.seat_name,
                  'seat_price', tk.ticket_amount,
                  'pickup_point', CASE 
                     WHEN bt.office_pickup_id IS NOT NULL THEN pickup_office.office_name
                     WHEN bt.transfer_point_name IS NOT NULL THEN bt.transfer_point_name
                     ELSE NULL
                  END,
                  'dropoff_point', CASE 
                     WHEN bt.office_dropoff_id IS NOT NULL THEN dropoff_office.office_name
                     WHEN bt.return_point_name IS NOT NULL THEN bt.return_point_name
                     ELSE NULL
                  END
            )
         ) as tickets_detail
         
      FROM booking_tickets bt
      -- Join với bảng customers (nếu là khách hàng đã đăng ký)
      LEFT JOIN customers c ON bt.customer_id = c.customer_id

      -- Join để lấy thông tin vé và ghế
      INNER JOIN booking_ticket_details btd ON bt.booking_id = btd.booking_id
      INNER JOIN tickets tk ON btd.ticket_id = tk.ticket_id
      INNER JOIN booking_seats bs ON tk.booking_seat_id = bs.booking_seat_id

      -- Join để lấy thông tin chuyến đi
      INNER JOIN trips t ON bs.trip_id = t.trip_id
      INNER JOIN routes r ON t.route_id = r.route_id
      INNER JOIN ways w ON r.way_id = w.way_id
      INNER JOIN offices origin_office ON origin_office.office_id = r.origin_office_id
      INNER JOIN offices destination_office ON destination_office.office_id = r.destination_office_id

      -- Join để lấy thông tin xe
      INNER JOIN vehicles v ON t.vehicle_id = v.vehicle_id
      INNER JOIN map_vehicle_layouts mvl ON v.map_vehicle_layout_id = mvl.map_vehicle_layout_id
      INNER JOIN vehicle_types vt ON mvl.vehicle_type_id = vt.vehicle_type_id

      -- Điểm đón
      LEFT JOIN offices pickup_office ON bt.office_pickup_id = pickup_office.office_id
      LEFT JOIN wards pickup_ward ON pickup_office.ward_id = pickup_ward.ward_id
      LEFT JOIN districts pickup_district ON pickup_ward.district_id = pickup_district.district_id
      LEFT JOIN provinces pickup ON pickup_district.province_id = pickup.province_id

      -- Điểm trả
      LEFT JOIN offices dropoff_office ON bt.office_dropoff_id = dropoff_office.office_id
      LEFT JOIN wards dropoff_ward ON dropoff_office.ward_id = dropoff_ward.ward_id
      LEFT JOIN districts dropoff_district ON dropoff_ward.district_id = dropoff_district.district_id
      LEFT JOIN provinces dropoff ON dropoff_district.province_id = dropoff.province_id

      WHERE bt.booking_code = :bookingCode
         AND bt.booking_status = 'confirmed'
         AND bt.payment_status = 'completed'
         AND bt.deleted_at IS NULL
      GROUP BY 
         bt.booking_id,
         t.trip_id,
         w.way_id,
         v.vehicle_license_plate,
         vt.vehicle_type_name,
         pickup.province_id,
         dropoff.province_id
      `;

      const bookingDetails = await db.sequelize.query(query, {
         replacements: {bookingCode},
         type: QueryTypes.SELECT,
      });

      if (!bookingDetails || bookingDetails.length === 0) {
         throw new __RESPONSE.NotFoundError({
            message: "Không tìm thấy thông tin đặt vé",
            error_code: "BOOKING_NOT_FOUND",
         });
      }

      // Sửa phần này
      const booking = bookingDetails[0];
      let parsedSeats = [];

      // Kiểm tra và parse booked_seats nếu là string
      if (booking.booked_seats) {
         try {
            parsedSeats =
               typeof booking.booked_seats === "string" ? JSON.parse(booking.booked_seats) : booking.booked_seats;
         } catch (error) {
            console.error("Error parsing booked_seats:", error);
            parsedSeats = [];
         }
      }

      try {
         const emailData = {
            to: booking?.customer_email || booking?.guest_email,
            subject: `[FUTA Bus Lines] - Xác nhận thanh toán vé xe thành công - (Đặt vé online - ${booking?.booking_code?.replace(
               /^BOOK/,
               ""
            )})`,
            template: "payment-success",
            context: {
               booking_code: booking?.booking_code?.replace(/^BOOK/, ""),
               link_booking: `${process.env.FRONTEND_URL}/booking/ticketinfo?code=${booking.booking_code}&phone=${
                  booking.customer_phone || booking.guest_phone
               }`,
               link_ticket: `${process.env.FRONTEND_URL}/booking/ticketinfo?code=${booking.booking_code}&phone=${
                  booking.customer_phone || booking.guest_phone
               }`,
               name: booking.customer_full_name || booking.guest_fullname,
               phone: booking.customer_phone || booking.guest_phone,
               email: booking.customer_email || booking.guest_email,
               ngay_dat: moment(booking.payment_time).format("HH:mm - DD/MM/YYYY"),
               gio_don:
                  "Giờ đón: " +
                  moment(booking.trip_departure_time).format("HH:mm - DD/MM/YYYY") +
                  " (Quý khách vui lòng đến sớm hơn 30 phút).",
               diem_don: (booking.pickup_office_name || booking.transfer_point_name) + " (Bến xe/Văn phòng đón)",
               diem_tra: (booking.dropoff_office_name || booking.return_point_name) + " (Bến xe/Văn phòng trả)",
               gia_ve: `${parsedSeats[0]?.seat_price?.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                  currencyDisplay: "symbol",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
               })}`,
               ghe: parsedSeats
                  ?.map(
                     (seat) =>
                        `${seat?.seat_name} (${seat?.seat_price?.toLocaleString("vi-VN", {
                           style: "currency",
                           currency: "VND",
                           currencyDisplay: "symbol",
                           minimumFractionDigits: 0,
                           maximumFractionDigits: 0,
                        })})`
                  )
                  .join(", "),
               loai_xe: booking.vehicle_type_name,
               tuyen_xe: booking.origin_office_name + " - " + booking.destination_office_name,
               tong_tien: new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                  currencyDisplay: "symbol",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
               }).format(booking.booking_total_payment),
            },
         };
         await sendEmail(emailData);
      } catch (emailError) {
         console.error("Lỗi khi gửi email:", emailError);
      }
      return {
         success: true,
         data: {
            booking_info: {
               booking_id: booking.booking_id,
               booking_code: booking.booking_code,
               booking_status: booking.booking_status,
               total_tickets: booking.booking_number_of_ticket,
               total_price: booking.booking_total_price,
               total_payment: booking.booking_total_payment,
               expiration_time: booking.booking_expiration_time,
               transfer_point_name: booking.transfer_point_name,
               return_point_name: booking.return_point_name,
            },
            customer_info: {
               name: booking.customer_full_name || booking.guest_fullname,
               phone: booking.customer_phone || booking.guest_phone,
               email: booking.customer_email || booking.guest_email,
            },
            trip_info: {
               trip_id: booking.trip_id,
               trip_price: booking.trip_price,
               trip_date: booking.trip_date,
               departure_time: booking.trip_departure_time,
               arrival_time: booking.trip_arrival_time,
               way_name: booking.way_name,
               trip_discount: booking.trip_discount,
               origin_office_name: booking.origin_office_name,
               destination_office_name: booking.destination_office_name,
               vehicle: {
                  license_plate: booking.vehicle_license_plate,
                  type: booking.vehicle_type_name,
               },
            },
            location_info: {
               pickup: {
                  province_id: booking.pickup_province_id,
                  province_name: booking.pickup_province_name,
                  district_name: booking.pickup_district_name,
                  ward_name: booking.pickup_ward_name,
                  office_name: booking.pickup_office_name,
                  office_address: booking.pickup_office_address,
               },
               dropoff: {
                  province_id: booking.dropoff_province_id,
                  province_name: booking.dropoff_province_name,
                  district_name: booking.dropoff_district_name,
                  ward_name: booking.dropoff_ward_name,
                  office_name: booking.dropoff_office_name,
                  office_address: booking.dropoff_office_address,
               },
            },
            seats: parsedSeats,
            tickets: booking.tickets_detail
               ? typeof booking.tickets_detail === "string"
                  ? JSON.parse(booking.tickets_detail)
                  : booking.tickets_detail
               : [],
         },
      };
   } catch (error) {
      if (error instanceof __RESPONSE.NotFoundError) {
         throw error;
      }
      throw new __RESPONSE.BadRequestError({
         message: "Đã có lỗi xảy ra khi lấy thông tin đặt vé " + error.message,
         error_code: "GET_BOOKING_DETAILS_ERROR",
      });
   }
};

const cancelBooking = async (req) => {
   const {bookingId, seats, tripId} = req.body;
   if (!bookingId || !seats || !tripId) {
      throw new __RESPONSE.BadRequestError({
         message: "Thiếu thông tin hủy đặt vé",
         error_code: "MISSING_BOOKING_INFO",
      });
   }

   const booking = await db.BookingTicket.findOne({
      where: {
         booking_code: bookingId,
         booking_status: "pending",
         payment_status: "pending",
         booking_expiration_time: {
            [db.Sequelize.Op.gt]: new Date(),
         },
      },
      attributes: {
         exclude: ["office_id"],
      },
   });

   if (!booking) {
      throw new __RESPONSE.NotFoundError({
         message: "Không tìm thấy thông tin đặt vé hoặc đã hết hạn",
         error_code: "BOOKING_NOT_FOUND",
      });
   }

   await booking.update({
      booking_status: "cancelled",
      payment_status: "failed",
   });

   await redis.del(`seat:${tripId}:${seats.map((seat) => seat?.seat_id)}`);

   return {
      success: true,
      message: "Đã hủy đặt vé thành công",
   };
};

function sortObject(obj) {
   let sorted = {};
   let str = [];
   let key;
   for (key in obj) {
      if (obj.hasOwnProperty(key)) {
         str.push(encodeURIComponent(key));
      }
   }
   str.sort();
   for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
   }
   return sorted;
}

const searchTicket = async (ticketCode, customerPhone) => {
   if (!ticketCode || !customerPhone) {
      throw new __RESPONSE.BadRequestError({
         message: "Thiếu thông tin tìm kiếm vé",
         error_code: "MISSING_SEARCH_TICKET_INFO",
      });
   }
   if (customerPhone.length !== 10) {
      throw new __RESPONSE.BadRequestError({
         message: "Số điện thoại không hợp lệ",
         error_code: "INVALID_PHONE_NUMBER",
      });
   }
   try {
      const query = `
         SELECT
            tk.ticket_id,
            tk.ticket_code,
            tk.ticket_amount,
            tk.is_export_ticket,
            bs.seat_name,
            bs.booking_seat_id,
            bt.*,
            COALESCE(c.customer_full_name, bt.guest_fullname) as customer_name,
            COALESCE(c.customer_phone, bt.guest_phone) as customer_phone,
            COALESCE(c.customer_email, bt.guest_email) as customer_email,
            t.*,
            w.way_name,
            v.vehicle_license_plate,
            vt.vehicle_type_name,
            origin_office.office_name as origin_office_name,
            origin_office.office_address as origin_office_address,
            destination_office.office_name as destination_office_name,
            destination_office.office_address as destination_office_address,
            pickup_office.office_id as pickup_office_id,
            pickup_office.office_name as pickup_office_name,
            pickup_office.office_address as pickup_office_address,
            pickup_ward.ward_id as pickup_ward_id,
            pickup_ward.ward_name as pickup_ward_name,
            pickup_district.district_id as pickup_district_id,
            pickup_district.district_name as pickup_district_name,
            pickup.province_id as pickup_province_id,
            pickup.province_name as pickup_province_name,
            dropoff_office.office_id as dropoff_office_id,
            dropoff_office.office_name as dropoff_office_name,
            dropoff_office.office_address as dropoff_office_address,
            dropoff_ward.ward_id as dropoff_ward_id,
            dropoff_ward.ward_name as dropoff_ward_name,
            dropoff_district.district_id as dropoff_district_id,
            dropoff_district.district_name as dropoff_district_name,
            dropoff.province_id as dropoff_province_id,
            dropoff.province_name as dropoff_province_name,
            bt.transfer_point_name,
            bt.return_point_name

         FROM tickets tk
         INNER JOIN booking_ticket_details btd ON tk.ticket_id = btd.ticket_id
         INNER JOIN booking_tickets bt ON btd.booking_id = bt.booking_id
         LEFT JOIN customers c ON c.customer_phone = :customerPhone
         INNER JOIN booking_seats bs ON tk.booking_seat_id = bs.booking_seat_id
         INNER JOIN trips t ON bs.trip_id = t.trip_id
         INNER JOIN routes r ON t.route_id = r.route_id
         INNER JOIN ways w ON r.way_id = w.way_id
         INNER JOIN vehicles v ON t.vehicle_id = v.vehicle_id
         INNER JOIN map_vehicle_layouts mvl ON v.map_vehicle_layout_id = mvl.map_vehicle_layout_id
         INNER JOIN vehicle_types vt ON mvl.vehicle_type_id = vt.vehicle_type_id
         INNER JOIN offices origin_office ON r.origin_office_id = origin_office.office_id
         INNER JOIN offices destination_office ON r.destination_office_id = destination_office.office_id
         LEFT JOIN offices pickup_office ON bt.office_pickup_id = pickup_office.office_id
         LEFT JOIN wards pickup_ward ON pickup_office.ward_id = pickup_ward.ward_id
         LEFT JOIN districts pickup_district ON pickup_ward.district_id = pickup_district.district_id
         LEFT JOIN provinces pickup ON pickup_district.province_id = pickup.province_id
         LEFT JOIN offices dropoff_office ON bt.office_dropoff_id = dropoff_office.office_id
         LEFT JOIN wards dropoff_ward ON dropoff_office.ward_id = dropoff_ward.ward_id
         LEFT JOIN districts dropoff_district ON dropoff_ward.district_id = dropoff_district.district_id
         LEFT JOIN provinces dropoff ON dropoff_district.province_id = dropoff.province_id
         LEFT JOIN refunds rf ON rf.ticket_id = tk.ticket_id

         WHERE tk.ticket_code = :ticketCode
         AND (c.customer_phone = :customerPhone OR bt.guest_phone = :customerPhone)
         AND bt.booking_status = 'confirmed'
         AND bt.payment_status = 'completed'
         AND rf.refund_id IS NULL
         AND bt.deleted_at IS NULL
      `;

      const ticketDetails = await db.sequelize.query(query, {
         replacements: {ticketCode, customerPhone},
         type: QueryTypes.SELECT,
      });

      if (!ticketDetails || ticketDetails.length === 0) {
         throw new __RESPONSE.NotFoundError({
            message: "Không tìm thấy thông tin vé",
            error_code: "TICKET_NOT_FOUND",
         });
      }

      const ticket = ticketDetails[0];
      let parsedSeats = [];

      return {
         success: true,
         data: {
            ticket_info: {
               ticket_id: ticket.ticket_id,
               ticket_code: ticket.ticket_code,
               ticket_amount: ticket.ticket_amount,
               is_export_ticket: ticket.is_export_ticket,
               seat_name: ticket.seat_name,
               seat_id: ticket.booking_seat_id,
            },
            customer_info: {
               name: ticket.customer_name,
               phone: ticket.customer_phone,
               email: ticket.customer_email,
            },
            booking_info: {
               booking_id: ticket.booking_id,
               booking_code: ticket.booking_code,
               booking_status: ticket.booking_status,
               total_tickets: ticket.booking_number_of_ticket,
               total_price: ticket.booking_total_price,
               total_payment: ticket.booking_total_payment,
               transfer_point_name: ticket.transfer_point_name,
               return_point_name: ticket.return_point_name,
            },
            trip_info: {
               trip_id: ticket.trip_id,
               trip_date: ticket.trip_date,
               departure_time: ticket.trip_departure_time,
               arrival_time: ticket.trip_arrival_time,
               way_name: ticket.way_name,
               trip_discount: ticket.trip_discount,
               origin_office_name: ticket.origin_office_name,
               origin_office_address: ticket.origin_office_address,
               destination_office_name: ticket.destination_office_name,
               destination_office_address: ticket.destination_office_address,
               vehicle: {
                  license_plate: ticket.vehicle_license_plate,
                  type: ticket.vehicle_type_name,
               },
            },
            location_info: {
               pickup: {
                  point: ticket.pickup_office_name,
                  address: ticket.pickup_office_address,
                  province: ticket.pickup_province_name,
                  district: ticket.pickup_district_name,
                  ward: ticket.pickup_ward_name,
               },
               dropoff: {
                  point: ticket.dropoff_office_name,
                  address: ticket.dropoff_office_address,
                  province: ticket.dropoff_province_name,
                  district: ticket.dropoff_district_name,
                  ward: ticket.dropoff_ward_name,
               },
            },
         },
      };
   } catch (error) {
      if (error instanceof __RESPONSE.NotFoundError) {
         throw error;
      }
      throw new __RESPONSE.BadRequestError({
         message: "Đã có lỗi xảy ra khi tìm kiếm vé: " + error.message,
         error_code: "SEARCH_TICKET_ERROR",
      });
   }
};

const getCustomerTickets = async (customerPhone) => {
   if (!customerPhone) {
      throw new __RESPONSE.BadRequestError({
         message: "Thiếu thông tin tìm kiếm vé",
         error_code: "MISSING_SEARCH_TICKET_INFO",
      });
   }

   try {
      const query = `
         SELECT
            tk.ticket_id,
            tk.ticket_code,
            tk.ticket_amount,
            tk.is_export_ticket,
            bs.seat_name,
            bs.booking_seat_id,
            bt.booking_id,
            bt.booking_code,
            bt.booking_status,
            bt.payment_status,
            bt.created_at as booking_created_at,
            bt.payment_time,
            -- Thông tin khách hàng
            COALESCE(c.customer_full_name, bt.guest_fullname) as customer_name,
            COALESCE(c.customer_phone, bt.guest_phone) as customer_phone,
            COALESCE(c.customer_email, bt.guest_email) as customer_email,
            t.trip_id,
            t.trip_date,
            t.trip_departure_time,
            t.trip_arrival_time,
            r.route_id,

            w.way_name,

            v.vehicle_license_plate,
            vt.vehicle_type_name,

            origin_office.office_name as origin_office_name,
            origin_office.office_address as origin_office_address,
            destination_office.office_name as destination_office_name,
            destination_office.office_address as destination_office_address,

            -- Thông tin điểm đón/trả
            CASE
               WHEN bt.office_pickup_id IS NOT NULL THEN pickup_office.office_name
               WHEN bt.transfer_point_name IS NOT NULL THEN bt.transfer_point_name
               ELSE NULL
            END as pickup_point,

            CASE
               WHEN bt.office_dropoff_id IS NOT NULL THEN dropoff_office.office_name
               WHEN bt.return_point_name IS NOT NULL THEN bt.return_point_name
               ELSE NULL
            END as dropoff_point,

            pickup_office.office_address as pickup_address,
            dropoff_office.office_address as dropoff_address,

            pickup.province_name as pickup_province,
            pickup_district.district_name as pickup_district,
            pickup_ward.ward_name as pickup_ward,

            dropoff.province_name as dropoff_province,
            dropoff_district.district_name as dropoff_district,
            dropoff_ward.ward_name as dropoff_ward,

            rv.review_id,
            rv.review_comment,
            rv.review_rating,
            rv.review_date,
            rv.last_lock_at,
            rv.is_locked

         FROM tickets tk
         INNER JOIN booking_ticket_details btd ON tk.ticket_id = btd.ticket_id
         INNER JOIN booking_tickets bt ON btd.booking_id = bt.booking_id
         LEFT JOIN customers c ON c.customer_phone = :customerPhone
         INNER JOIN booking_seats bs ON tk.booking_seat_id = bs.booking_seat_id
         INNER JOIN trips t ON bs.trip_id = t.trip_id
         INNER JOIN routes r ON t.route_id = r.route_id
         INNER JOIN ways w ON r.way_id = w.way_id
         INNER JOIN vehicles v ON t.vehicle_id = v.vehicle_id
         INNER JOIN map_vehicle_layouts mvl ON v.map_vehicle_layout_id = mvl.map_vehicle_layout_id
         INNER JOIN vehicle_types vt ON mvl.vehicle_type_id = vt.vehicle_type_id
         INNER JOIN offices origin_office ON r.origin_office_id = origin_office.office_id
         INNER JOIN offices destination_office ON r.destination_office_id = destination_office.office_id

         -- Điểm đón
         LEFT JOIN offices pickup_office ON bt.office_pickup_id = pickup_office.office_id
         LEFT JOIN wards pickup_ward ON pickup_office.ward_id = pickup_ward.ward_id
         LEFT JOIN districts pickup_district ON pickup_ward.district_id = pickup_district.district_id
         LEFT JOIN provinces pickup ON pickup_district.province_id = pickup.province_id

         -- Điểm trả
         LEFT JOIN offices dropoff_office ON bt.office_dropoff_id = dropoff_office.office_id
         LEFT JOIN wards dropoff_ward ON dropoff_office.ward_id = dropoff_ward.ward_id
         LEFT JOIN districts dropoff_district ON dropoff_ward.district_id = dropoff_district.district_id
         LEFT JOIN provinces dropoff ON dropoff_district.province_id = dropoff.province_id

         LEFT JOIN reviews rv ON rv.booking_id = bt.booking_id
         LEFT JOIN refunds rf ON rf.ticket_id = tk.ticket_id

         WHERE (c.customer_phone = :customerPhone )
         AND bt.customer_id = c.customer_id
         AND bt.deleted_at IS NULL
         AND rf.refund_id IS NULL
         ORDER BY tk.ticket_id DESC
      `;

      const tickets = await db.sequelize.query(query, {
         replacements: {customerPhone},
         type: QueryTypes.SELECT,
      });

      if (!tickets || tickets.length === 0) {
         return {
            success: true,
            message: "Không tìm thấy vé nào",
            data: [],
         };
      }

      const formattedTickets = tickets.map((ticket) => ({
         ticket_info: {
            ticket_id: ticket.ticket_id,
            ticket_code: ticket.ticket_code,
            ticket_amount: ticket.ticket_amount,
            is_export_ticket: ticket.is_export_ticket,
            seat_name: ticket.seat_name,
            seat_id: ticket.booking_seat_id,
         },
         customer_info: {
            name: ticket.customer_name,
            phone: ticket.customer_phone,
            email: ticket.customer_email,
         },
         booking_info: {
            booking_id: ticket.booking_id,
            booking_code: ticket.booking_code,
            booking_status: ticket.booking_status,
            payment_status: ticket.payment_status,
            created_at: ticket.booking_created_at,
            payment_time: ticket.payment_time,
         },
         trip_info: {
            trip_id: ticket.trip_id,
            trip_date: ticket.trip_date,
            route_id: ticket.route_id,
            departure_time: ticket.trip_departure_time,
            arrival_time: ticket.trip_arrival_time,
            way_name: ticket.way_name,
            origin: {
               office_name: ticket.origin_office_name,
               office_address: ticket.origin_office_address,
            },
            destination: {
               office_name: ticket.destination_office_name,
               office_address: ticket.destination_office_address,
            },
            vehicle: {
               license_plate: ticket.vehicle_license_plate,
               type: ticket.vehicle_type_name,
            },
         },
         location_info: {
            pickup: {
               point: ticket.pickup_point,
               address: ticket.pickup_address,
               province: ticket.pickup_province,
               district: ticket.pickup_district,
               ward: ticket.pickup_ward,
            },
            dropoff: {
               point: ticket.dropoff_point,
               address: ticket.dropoff_address,
               province: ticket.dropoff_province,
               district: ticket.dropoff_district,
               ward: ticket.dropoff_ward,
            },
         },

         review_info: ticket.review_id
            ? {
                 review_id: ticket.review_id,
                 content: ticket.review_comment,
                 rating: ticket.review_rating,
                 created_at: ticket.review_date,
                 review_date: ticket.review_date,
                 is_locked: ticket.is_locked,
                 last_lock_at: ticket.last_lock_at,
              }
            : null,
      }));

      return {
         success: true,
         data: formattedTickets,
      };
   } catch (error) {
      throw new __RESPONSE.BadRequestError({
         message: "Đã có lỗi xảy ra khi lấy danh sách vé: " + error.message,
         error_code: "GET_CUSTOMER_TICKETS_ERROR",
      });
   }
};

const getCustomerTicketsRefund = async (customerPhone) => {
   if (!customerPhone) {
      throw new __RESPONSE.BadRequestError({
         message: "Thiếu thông tin tìm kiếm lịch sử yêu cầu hủy vé",
         error_code: "MISSING_SEARCH_TICKET_INFO_REFUND",
      });
   }

   try {
      const query = `
         SELECT
            -- Thông tin refund
            rf.refund_id,
            rf.refund_code,
            rf.refund_amount,
            rf.refund_description,
            rf.refund_percentage,
            rf.created_at as refund_created_at,
            rf.refunded_at,
            rf.is_refunded,
            rf.refund_method,
            rf.is_approved,
            
            -- Thông tin vé và các thông tin khác giữ nguyên
            tk.ticket_id,
            tk.ticket_code,
            tk.ticket_amount,
            tk.is_export_ticket,
            bs.seat_name,
            bs.booking_seat_id,
            bt.booking_id,
            bt.booking_code,
            bt.booking_status,
            bt.payment_status,
            bt.created_at as booking_created_at,
            bt.payment_time,
            bt.booking_total_payment,
            bt.discount_amount,
            bt.booking_number_of_ticket,
            
            -- Thông tin khách hàng
            COALESCE(c.customer_full_name, bt.guest_fullname) as customer_name,
            COALESCE(c.customer_phone, bt.guest_phone) as customer_phone,
            COALESCE(c.customer_email, bt.guest_email) as customer_email,
            
            -- Thông tin chuyến đi
            t.trip_id,
            t.trip_date,
            t.trip_departure_time,
            t.trip_arrival_time,
            w.way_name,
            
            -- Thông tin xe
            v.vehicle_license_plate,
            vt.vehicle_type_name,
            
            -- Thông tin văn phòng
            origin_office.office_name as origin_office_name,
            origin_office.office_address as origin_office_address,
            destination_office.office_name as destination_office_name,
            destination_office.office_address as destination_office_address,

            -- Thông tin điểm đón/trả
            CASE
               WHEN bt.office_pickup_id IS NOT NULL THEN pickup_office.office_name
               WHEN bt.transfer_point_name IS NOT NULL THEN bt.transfer_point_name
               ELSE NULL
            END as pickup_point,

            CASE
               WHEN bt.office_dropoff_id IS NOT NULL THEN dropoff_office.office_name
               WHEN bt.return_point_name IS NOT NULL THEN bt.return_point_name
               ELSE NULL
            END as dropoff_point,

            pickup_office.office_address as pickup_address,
            dropoff_office.office_address as dropoff_address,

            pickup.province_name as pickup_province,
            pickup_district.district_name as pickup_district,
            pickup_ward.ward_name as pickup_ward,

            dropoff.province_name as dropoff_province,
            dropoff_district.district_name as dropoff_district,
            dropoff_ward.ward_name as dropoff_ward

         FROM refunds rf
         INNER JOIN tickets tk ON rf.ticket_id = tk.ticket_id
         INNER JOIN booking_ticket_details btd ON tk.ticket_id = btd.ticket_id
         INNER JOIN booking_tickets bt ON btd.booking_id = bt.booking_id
         LEFT JOIN customers c ON c.customer_phone = :customerPhone
         INNER JOIN booking_seats bs ON tk.booking_seat_id = bs.booking_seat_id
         INNER JOIN trips t ON bs.trip_id = t.trip_id
         INNER JOIN routes r ON t.route_id = r.route_id
         INNER JOIN ways w ON r.way_id = w.way_id
         INNER JOIN vehicles v ON t.vehicle_id = v.vehicle_id
         INNER JOIN map_vehicle_layouts mvl ON v.map_vehicle_layout_id = mvl.map_vehicle_layout_id
         INNER JOIN vehicle_types vt ON mvl.vehicle_type_id = vt.vehicle_type_id
         INNER JOIN offices origin_office ON r.origin_office_id = origin_office.office_id
         INNER JOIN offices destination_office ON r.destination_office_id = destination_office.office_id

         -- Điểm đón
         LEFT JOIN offices pickup_office ON bt.office_pickup_id = pickup_office.office_id
         LEFT JOIN wards pickup_ward ON pickup_office.ward_id = pickup_ward.ward_id
         LEFT JOIN districts pickup_district ON pickup_ward.district_id = pickup_district.district_id
         LEFT JOIN provinces pickup ON pickup_district.province_id = pickup.province_id

         -- Điểm trả
         LEFT JOIN offices dropoff_office ON bt.office_dropoff_id = dropoff_office.office_id
         LEFT JOIN wards dropoff_ward ON dropoff_office.ward_id = dropoff_ward.ward_id
         LEFT JOIN districts dropoff_district ON dropoff_ward.district_id = dropoff_district.district_id
         LEFT JOIN provinces dropoff ON dropoff_district.province_id = dropoff.province_id

         WHERE (c.customer_phone = :customerPhone)
         AND bt.customer_id = c.customer_id
         AND bt.deleted_at IS NULL
         AND rf.deleted_at IS NULL
         ORDER BY rf.created_at DESC
      `;

      const tickets = await db.sequelize.query(query, {
         replacements: {customerPhone},
         type: QueryTypes.SELECT,
      });

      if (!tickets || tickets.length === 0) {
         return {
            success: true,
            message: "Không tìm thấy yêu cầu hủy vé nào",
            data: [],
         };
      }

      const formattedTickets = tickets.map((ticket) => ({
         refund_info: {
            refund_id: ticket.refund_id,
            refund_code: ticket.refund_code,
            refund_amount: ticket.refund_amount,
            refund_description: ticket.refund_description,
            refund_percentage: ticket.refund_percentage,
            created_at: ticket.refund_created_at,
            refunded_at: ticket.refunded_at,
            is_refunded: ticket.is_refunded,
            refund_method: ticket.refund_method,
            is_approved: ticket.is_approved,
         },
         ticket_info: {
            ticket_id: ticket.ticket_id,
            ticket_code: ticket.ticket_code,
            ticket_amount: ticket.ticket_amount,
            is_export_ticket: ticket.is_export_ticket,
            seat_name: ticket.seat_name,
            seat_id: ticket.booking_seat_id,
         },
         customer_info: {
            name: ticket.customer_name,
            phone: ticket.customer_phone,
            email: ticket.customer_email,
         },
         booking_info: {
            booking_id: ticket.booking_id,
            booking_code: ticket.booking_code,
            booking_status: ticket.booking_status,
            payment_status: ticket.payment_status,
            created_at: ticket.booking_created_at,
            payment_time: ticket.payment_time,
            booking_total_payment: ticket.booking_total_payment,
            discount_amount: ticket.discount_amount,
            booking_number_of_ticket: ticket.booking_number_of_ticket,
         },
         trip_info: {
            trip_id: ticket.trip_id,
            trip_date: ticket.trip_date,
            departure_time: ticket.trip_departure_time,
            arrival_time: ticket.trip_arrival_time,
            way_name: ticket.way_name,
            origin: {
               office_name: ticket.origin_office_name,
               office_address: ticket.origin_office_address,
            },
            destination: {
               office_name: ticket.destination_office_name,
               office_address: ticket.destination_office_address,
            },
            vehicle: {
               license_plate: ticket.vehicle_license_plate,
               type: ticket.vehicle_type_name,
            },
         },
         location_info: {
            pickup: {
               point: ticket.pickup_point,
               address: ticket.pickup_address,
               province: ticket.pickup_province,
               district: ticket.pickup_district,
               ward: ticket.pickup_ward,
            },
            dropoff: {
               point: ticket.dropoff_point,
               address: ticket.dropoff_address,
               province: ticket.dropoff_province,
               district: ticket.dropoff_district,
               ward: ticket.dropoff_ward,
            },
         },
      }));

      return {
         success: true,
         data: formattedTickets,
      };
   } catch (error) {
      throw new __RESPONSE.BadRequestError({
         message: "Đã có lỗi xảy ra khi lấy danh sách yêu cầu hủy vé: " + error.message,
         error_code: "GET_CUSTOMER_TICKETS_REFUND_ERROR",
      });
   }
};

const countBookingTickets = async () => {
   return await db.BookingTicket.count({
      where: {
         payment_status: "completed",
         booking_status: "confirmed",
      },
   })
      .then((count) => {
         return {
            count: count,
         };
      })
      .catch((error) => {
         throw new __RESPONSE.BadRequestError({
            message: "Count booking tickets failed " + error.message,
            suggestion: "Please check again your request",
         });
      });
};

module.exports = {
   createBookingTickets,
   checkBookingStatus,
   getPaymenVNPaytUrl,
   getBookingDetailsByCode,
   cancelBooking,
   updateBookingAfterPaymentVNPay,
   getInfoBookingTiketsSuccess,
   searchTicket,
   getCustomerTickets,
   getCustomerTicketsRefund,
   countBookingTickets,
};
