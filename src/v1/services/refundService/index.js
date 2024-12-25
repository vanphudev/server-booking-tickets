"use strict";
const __RESPONSE = require("../../core");
const db = require("../../models");
const {QueryTypes} = require("sequelize");
const sendRefund = require("../../utils/sendRefund");
const sendRefundSuccess = require("../../utils/sendRefundSucsess");

const refund = async (req) => {
   const {ticket_code, customer_phone, refund_description} = req.body;
   if (!ticket_code || !customer_phone || !refund_description) {
      throw new __RESPONSE.BadRequestError({
         message: "Vui lòng nhập đầy đủ thông tin để thực hiện hoàn vé!",
      });
   }

   // lấy thông tin vé đó.
   const ticket = await db.Ticket.findOne({
      where: {
         ticket_code: ticket_code,
      },
   });

   if (!ticket) {
      throw new __RESPONSE.BadRequestError({
         message: "Vé xe này không tồn tại!",
         error_code: "TICKET_NOT_FOUND",
      });
   }

   // kiểm tả evs đã được hoàn vé hay chưa.
   const refund = await db.Refund.findOne({
      where: {
         ticket_id: ticket.ticket_id,
      },
      attributes: {
         exclude: ["office_id"],
      },
   });

   if (refund) {
      throw new __RESPONSE.BadRequestError({
         message: "Vé xe này đã được hoàn vé!",
         error_code: "TICKET_ALREADY_REFUNDED",
      });
   }

   // kiểm tra vé đó có thuộc của khách hàng này hay không.
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

         WHERE tk.ticket_code = :ticketCode
         AND (c.customer_phone = :customerPhone)
         AND bt.booking_status = 'confirmed'
         AND bt.payment_status = 'completed'
         AND bt.deleted_at IS NULL
      `;

   const result = await db.sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: {
         ticketCode: ticket.ticket_code,
         customerPhone: customer_phone,
      },
   });

   if (result.length === 0) {
      throw new __RESPONSE.BadRequestError({
         message: "Khách hàng không có vé này!",
         error_code: "TICKET_NOT_FOUND_BY_CUSTOMER",
      });
   }

   const ticketInfo = result[0];
   const tripStartTime = new Date(ticketInfo.trip_departure_time).getTime();
   const currentTime = Date.now();

   const timeDiff = tripStartTime - currentTime;
   const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));

   console.log("departure_time:", ticketInfo.departure_time);
   console.log("tripStartTime:", tripStartTime);
   console.log("currentTime:", currentTime);
   console.log("timeDiff:", timeDiff);
   console.log("hoursDiff:", hoursDiff);

   const bookingQuery = `
      SELECT 
         bt.booking_total_payment,
         COUNT(tk.ticket_id) as total_tickets
      FROM booking_tickets bt
      INNER JOIN booking_ticket_details btd ON bt.booking_id = btd.booking_id
      INNER JOIN tickets tk ON btd.ticket_id = tk.ticket_id
      WHERE bt.booking_id = :bookingId
      GROUP BY bt.booking_id, bt.booking_total_payment
   `;

   const bookingResult = await db.sequelize.query(bookingQuery, {
      type: QueryTypes.SELECT,
      replacements: {
         bookingId: ticketInfo.booking_id,
      },
   });

   const actualTicketAmount = bookingResult[0].booking_total_payment / bookingResult[0].total_tickets;

   // Kiểm tra điều kiện hoàn vé
   if (hoursDiff < 12) {
      throw new __RESPONSE.BadRequestError({
         message: "Không thể hoàn vé khi thời gian đến chuyến đi dưới 12 giờ!",
         error_code: "REFUND_TIME_EXPIRED",
      });
   }

   // Tính tỷ lệ hoàn tiền
   let refundPercentage = 0;
   if (hoursDiff >= 48) {
      refundPercentage = 0.4; // 40%
   } else if (hoursDiff >= 24) {
      refundPercentage = 0.3; // 30%
   } else {
      refundPercentage = 0.2; // 20%
   }

   // Tính số tiền hoàn trả dựa trên số tiền thực tế
   const refundAmount = actualTicketAmount * refundPercentage;

   // Tạo bản ghi hoàn vé
   const refundRecord = await db.Refund.create({
      ticket_id: ticketInfo.ticket_id,
      refund_amount: refundAmount,
      refund_code:
         "REFUND_" +
         Math.random().toString(36).substring(2, 15).toUpperCase() +
         Math.random().toString(36).substring(2, 15).toUpperCase(),
      refund_description: refund_description || "Hoàn vé do khách hàng yêu cầu - Online!",
      refund_percentage: refundPercentage * 100,
      is_refunded: 0,
      refunded_at: new Date(),
      refund_method: "online",
      is_approved: 0,
   });

   await db.BookingSeat.update(
      {
         booking_seat_status: 0,
      },
      {
         where: {
            booking_seat_id: ticketInfo.booking_seat_id,
         },
      }
   );

   await sendRefund({
      to: ticketInfo.customer_email,
      subject:
         "[FUTA Bus Lines] - Xác nhận hoàn vé của quý khách " +
         ticketInfo.customer_name +
         " - " +
         ticketInfo.ticket_code,
      template: "refund",
      context: {
         customerName: ticketInfo?.customer_name,
         customerEmail: ticketInfo?.customer_email,
         customerPhone: ticketInfo?.customer_phone,
         ticketCode: ticketInfo?.ticket_code,
         refundCode: refundRecord?.refund_code,
         refundAmount: formatCurrency(refundAmount),
         refundPercentage: refundPercentage * 100,
      },
   });

   return {
      message: "Yêu cầu hoàn vé đã được xử lý thành công và đang chờ duyệt!",
      refund_info: {
         ticket_code: ticketInfo.ticket_code,
         refund_amount: refundAmount,
         refund_percentage: refundPercentage * 100,
         refund_code: refundRecord.refund_code,
      },
   };
};

const formatCurrency = (amount) => {
   return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
   }).format(amount);
};

const get_refund_all = async () => {
   const query = `
      SELECT 
         r.*,
         e.employee_id,
         e.employee_full_name,
         e.employee_email,
         e.employee_phone,
         t.ticket_code,
         t.ticket_amount,
         bt.booking_code,
         bt.booking_total_payment,
         bt.booking_status,
         bt.payment_status,
         COALESCE(bt.customer_id, c.customer_id) as customer_id,
         COALESCE(c.customer_full_name, bt.guest_fullname) as customer_name,
         COALESCE(c.customer_phone, bt.guest_phone) as customer_phone,
         COALESCE(c.customer_email, bt.guest_email) as customer_email
      FROM refunds r
      LEFT JOIN employees e ON r.employee_id = e.employee_id
      INNER JOIN tickets t ON r.ticket_id = t.ticket_id
      INNER JOIN booking_ticket_details btd ON t.ticket_id = btd.ticket_id
      INNER JOIN booking_tickets bt ON btd.booking_id = bt.booking_id
      LEFT JOIN customers c ON bt.customer_id = c.customer_id
      WHERE r.deleted_at IS NULL
      ORDER BY r.refunded_at DESC
   `;

   const refunds = await db.sequelize.query(query, {
      type: QueryTypes.SELECT,
   });

   return {
      refunds,
      total: refunds.length,
   };
};

const get_refund_today = async () => {
   const query = `
     SELECT 
         r.*,
         e.employee_id,
         e.employee_full_name,
         e.employee_email,
         e.employee_phone,
         t.ticket_code,
         t.ticket_amount,
         bt.booking_code,
         bt.booking_total_payment,
         bt.booking_status,
         bt.payment_status,
         COALESCE(bt.customer_id, c.customer_id) as customer_id,
         COALESCE(c.customer_full_name, bt.guest_fullname) as customer_name,
         COALESCE(c.customer_phone, bt.guest_phone) as customer_phone,
         COALESCE(c.customer_email, bt.guest_email) as customer_email
      FROM refunds r
      LEFT JOIN employees e ON r.employee_id = e.employee_id
      INNER JOIN tickets t ON r.ticket_id = t.ticket_id
      INNER JOIN booking_ticket_details btd ON t.ticket_id = btd.ticket_id
      INNER JOIN booking_tickets bt ON btd.booking_id = bt.booking_id
      LEFT JOIN customers c ON bt.customer_id = c.customer_id
      WHERE r.deleted_at IS NULL
      AND DATE(r.refunded_at) = CURDATE()
      ORDER BY r.refunded_at DESC
   `;

   const refunds = await db.sequelize.query(query, {
      type: QueryTypes.SELECT,
   });

   return {
      refunds,
      total: refunds.length,
   };
};

const get_refund_no_approved = async () => {
   const query = `
      SELECT 
         r.*,
         e.employee_id,
         e.employee_full_name,
         e.employee_email,
         e.employee_phone,
         t.ticket_code,
         t.ticket_amount,
         bt.booking_code,
         bt.booking_total_payment,
         bt.booking_status,
         bt.payment_status,
         COALESCE(bt.customer_id, c.customer_id) as customer_id,
         COALESCE(c.customer_full_name, bt.guest_fullname) as customer_name,
         COALESCE(c.customer_phone, bt.guest_phone) as customer_phone,
         COALESCE(c.customer_email, bt.guest_email) as customer_email
      FROM refunds r
      LEFT JOIN employees e ON r.employee_id = e.employee_id
      INNER JOIN tickets t ON r.ticket_id = t.ticket_id
      INNER JOIN booking_ticket_details btd ON t.ticket_id = btd.ticket_id
      INNER JOIN booking_tickets bt ON btd.booking_id = bt.booking_id
      LEFT JOIN customers c ON bt.customer_id = c.customer_id
      WHERE r.deleted_at IS NULL
      AND r.is_approved = 0
      ORDER BY r.refunded_at DESC
   `;

   const refunds = await db.sequelize.query(query, {
      type: QueryTypes.SELECT,
   });

   return {
      refunds,
      total: refunds.length,
   };
};

const approve_refund = async (req) => {
   const {refund_id, employee_id} = req.body;
   if (!refund_id || !employee_id) {
      throw new __RESPONSE.BadRequestError({
         message: "Vui lòng nhập đầy đủ thông tin để thực hiện duyệt hoàn vé!",
      });
   }

   const refund = await db.Refund.findOne({
      where: {
         refund_id: refund_id,
      },
      attributes: {
         exclude: ["office_id"],
      },
   });

   if (!refund) {
      throw new __RESPONSE.BadRequestError({
         message: "Hoàn vé không tồn tại!",
      });
   }

   await db.Refund.update(
      {
         is_approved: 1,
         is_refunded: 1,
         employee_id: employee_id,
      },
      {
         where: {refund_id: refund_id},
      }
   );

   // lấy thông tin nhân viên.
   const employee = await db.Employee.findOne({
      where: {employee_id: employee_id},
   });

   // Thay vì chỉ lấy customer từ refund.customer_id
   const query = `
      SELECT 
         t.ticket_code,
         COALESCE(c.customer_full_name, bt.guest_fullname) as customer_name,
         COALESCE(c.customer_email, bt.guest_email) as customer_email,
         COALESCE(c.customer_phone, bt.guest_phone) as customer_phone
      FROM refunds r
      INNER JOIN tickets t ON r.ticket_id = t.ticket_id 
      INNER JOIN booking_ticket_details btd ON t.ticket_id = btd.ticket_id
      INNER JOIN booking_tickets bt ON btd.booking_id = bt.booking_id
      LEFT JOIN customers c ON bt.customer_id = c.customer_id
      WHERE r.refund_id = :refundId
   `;

   const [customerInfo] = await db.sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: {
         refundId: refund_id,
      },
   });

   await sendRefundSuccess({
      to: customerInfo.customer_email,
      subject:
         "[FUTA Bus Lines] - Xác nhận hoàn vé của quý khách " +
         customerInfo.customer_name +
         " - " +
         customerInfo.ticket_code,
      template: "refund-success",
      context: {
         customerName: customerInfo.customer_name,
         customerEmail: customerInfo.customer_email,
         customerPhone: customerInfo.customer_phone,
         ticketCode: customerInfo.ticket_code,
         refundCode: refund.refund_code,
         refundAmount: formatCurrency(refund.refund_amount),
         refundPercentage: refund.refund_percentage,
         refundDescription: refund.refund_description,
         employeeName: employee?.employee_full_name || "Chưa có thông tin",
      },
   });
   return {
      message: "Duyệt hoàn vé thành công!",
   };
};

module.exports = {
   refund,
   get_refund_all,
   get_refund_today,
   get_refund_no_approved,
   approve_refund,
};
