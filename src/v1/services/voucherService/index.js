"use strict";

const __RESPONSE = require("../../core");
const db = require("../../models");

const getAllVouchers = async () => {
   return await db.Voucher.findAll({
      include: [
         {
            model: db.Employee,
            as: "voucher_belongto_employee",
            attributes: ["employee_id"],
         },
      ],
      attributes: [
         "voucher_id",
         "voucher_code",
         "voucher_discount_percentage",
         "voucher_discount_max_amount",
         "voucher_usage_limit",
         "voucher_valid_from",
         "voucher_valid_to",
      ],
      nest: true,
      raw: true,
   })
      .then((vouchers) => {
         if (vouchers.length === 0 || !vouchers) {
            throw new __RESPONSE.NotFoundError({
               message: "Vouchers not found !",
               suggestion: "Please check your request",
            });
         }
         return {
            vouchers,
            total: vouchers.length,
         };
      })
      .catch((error) => {
         throw new __RESPONSE.InternalServerError({
            message: "Lỗi khi lấy danh sách voucher!",
            suggestion: "Vui lòng kiểm tra lại yêu cầu",
         });
      });
};

const getVoucherByCode = async (req) => {
   const {code, amount, bookingCode} = req.query;
   if (!code) {
      throw new __RESPONSE.BadRequestError({
         message: "Mã voucher là bắt buộc - Kiểm tra lại voucher bạn nhé!",
         suggestion: "Please check your request",
         request: req,
      });
   }
   if (!amount) {
      throw new __RESPONSE.BadRequestError({
         message: "Hóa đơn là bắt buộc - Kiểm tra lại hóa đơn bạn nhé!",
         suggestion: "Please check your request",
         request: req,
      });
   }
   if (!bookingCode) {
      throw new __RESPONSE.BadRequestError({
         message: "Mã booking là bắt buộc - Kiểm tra lại booking bạn nhé!",
         suggestion: "Please check your request",
         request: req,
      });
   }
   const booking = await db.BookingTicket.findOne({
      where: {
         booking_code: bookingCode,
      },
      attributes: {exclude: ["office_id"]},
   });
   if (!booking) {
      throw new __RESPONSE.NotFoundError({
         message: "Mã booking không tồn tại - Kiểm tra lại booking bạn nhé!",
         suggestion: "Please check your request",
         request: req,
      });
   }
   const voucherWithConditions = await db.Voucher.findOne({
      where: {
         voucher_code: code,
      },
   });
   if (!voucherWithConditions) {
      throw new __RESPONSE.NotFoundError({
         message: "Mã voucher không tồn tại - Kiểm tra lại voucher bạn nhé!",
         suggestion: "Please check your request",
         request: req,
      });
   }
   if (voucherWithConditions.voucher_usage_limit === 0) {
      throw new __RESPONSE.BadRequestError({
         message: "Voucher đã hết lượt sử dụng - Kiểm tra lại voucher bạn nhé!",
         suggestion: "Please check your request",
         request: req,
      });
   }
   if (voucherWithConditions.voucher_usage_limit < 0) {
      throw new __RESPONSE.BadRequestError({
         message: "Voucher đã hết lượt sử dụng - Kiểm tra lại voucher bạn nhé!",
         suggestion: "Please check your request",
         request: req,
      });
   }
   // kiêm tra voucher có hết hạn chưa voucher_valid_from đến voucher_valid_to và voucher_usage_limit
   if (voucherWithConditions.voucher_valid_from && voucherWithConditions.voucher_valid_to) {
      const currentDate = new Date();
      if (currentDate < voucherWithConditions.voucher_valid_from) {
         throw new __RESPONSE.BadRequestError({
            message: "Voucher chưa được áp dụng - Kiểm tra lại voucher bạn nhé!",
            suggestion: "Please check your request",
            request: req,
         });
      }
      if (currentDate > voucherWithConditions.voucher_valid_to) {
         throw new __RESPONSE.BadRequestError({
            message: "Voucher đã hết hạn - Kiểm tra lại voucher bạn nhé!",
            suggestion: "Please check your request",
            request: req,
         });
      }

      if (voucherWithConditions.voucher_discount_max_amount > amount) {
         throw new __RESPONSE.BadRequestError({
            message:
               "Hóa đơn phải từ " +
               voucherWithConditions.voucher_discount_max_amount +
               " VNĐ trở lên - Kiểm tra lại hóa đơn bạn nhé!",
            suggestion: "Please check your request",
            request: req,
         });
      }

      // update booking ticket
      await db.BookingTicket.update(
         {
            voucher_id: voucherWithConditions.voucher_id,
            discount_amount: (voucherWithConditions.voucher_discount_percentage * amount) / 100,
         },
         {where: {booking_code: bookingCode}}
      );
   }
   return {
      voucher: voucherWithConditions,
      amount: amount,
      discount_amount: (voucherWithConditions.voucher_discount_percentage * amount) / 100,
   };
};

const createVoucher = async (req) => {
   const {
      voucher_code,
      voucher_discount_percentage,
      voucher_discount_max_amount,
      voucher_usage_limit,
      voucher_valid_from,
      voucher_valid_to,
      voucher_created_by,
   } = req.body;
   if (!voucher_code) {
      throw new __RESPONSE.BadRequestError({
         message: "Mã voucher không được để trống!",
         suggestion: "Vui lòng nhập mã voucher",
         request: req,
      });
   }

   if (!voucher_discount_percentage || voucher_discount_percentage <= 0 || voucher_discount_percentage > 100) {
      throw new __RESPONSE.BadRequestError({
         message: "Phần trăm giảm giá không hợp lệ!",
         suggestion: "Vui lòng nhập phần trăm giảm giá từ 1-100",
         request: req,
      });
   }

   if (!voucher_discount_max_amount || voucher_discount_max_amount < 0) {
      throw new __RESPONSE.BadRequestError({
         message: "Số tiền giảm tối thiểu không hợp lệ!",
         suggestion: "Vui lòng nhập số tiền giảm tối đa lớn hơn 0",
         request: req,
      });
   }

   if (!voucher_usage_limit || voucher_usage_limit <= 0) {
      throw new __RESPONSE.BadRequestError({
         message: "Số lần sử dụng không hợp lệ!",
         suggestion: "Vui lòng nhập số lần sử dụng lớn hơn 0",
         request: req,
      });
   }

   if (!voucher_valid_from) {
      throw new __RESPONSE.BadRequestError({
         message: "Ngày bắt đầu không được để trống!",
         suggestion: "Vui lòng chọn ngày bắt đầu",
         request: req,
      });
   }

   if (!voucher_valid_to) {
      throw new __RESPONSE.BadRequestError({
         message: "Ngày kết thúc không được để trống!",
         suggestion: "Vui lòng chọn ngày kết thúc",
         request: req,
      });
   }

   if (new Date(voucher_valid_from) >= new Date(voucher_valid_to)) {
      throw new __RESPONSE.BadRequestError({
         message: "Ngày kết thúc phải sau ngày bắt đầu!",
         suggestion: "Vui lòng kiểm tra lại thời gian hiệu lực",
         request: req,
      });
   }

   if (!voucher_created_by) {
      throw new __RESPONSE.BadRequestError({
         message: "Người tạo voucher không được để trống!",
         suggestion: "Vui lòng nhập người tạo voucher",
         request: req,
      });
   }

   return await db.Voucher.create({
      voucher_code: voucher_code.toUpperCase(),
      voucher_discount_percentage: voucher_discount_percentage,
      voucher_discount_max_amount: voucher_discount_max_amount,
      voucher_usage_limit: voucher_usage_limit,
      voucher_valid_from: voucher_valid_from,
      voucher_valid_to: voucher_valid_to,
      voucher_created_by: voucher_created_by,
   })
      .then((voucher) => {
         if (!voucher) {
            throw new __RESPONSE.BadRequestError({
               message: "Tạo voucher thất bại - Kiểm tra lại voucher bạn nhé!",
               suggestion: "Please check your request",
               request: req,
            });
         }
         return {
            voucher,
         };
      })
      .catch((error) => {
         if (error.original && error.original.code === "ER_DUP_ENTRY") {
            const duplicateField = error.original.sqlMessage.match(/for key '(.+?)'/)[1];
            let fieldName = "";

            switch (duplicateField) {
               case "voucher_code":
                  fieldName = "Mã voucher";
                  break;
               default:
                  fieldName = duplicateField;
            }

            throw new __RESPONSE.BadRequestError({
               message: `${fieldName} đã tồn tại - Vui lòng kiểm tra và thử lại!`,
               suggestion: "Vui lòng kiểm tra và sử dụng giá trị khác",
               request: req,
            });
         }
         throw new __RESPONSE.BadRequestError({
            message: "Error in creating voucher",
            suggestion: "Please check your request",
            request: req,
         });
      });
};

const updateVoucher = async (req) => {
   const {
      voucher_id,
      voucher_code,
      voucher_discount_percentage,
      voucher_discount_max_amount,
      voucher_usage_limit,
      voucher_valid_from,
      voucher_valid_to,
      voucher_created_by,
   } = req.body;

   if (!voucher_code || voucher_code.length < 3 || voucher_code.length > 100) {
      throw new __RESPONSE.BadRequestError({
         message: "Mã voucher không hợp lệ - Độ dài từ 3-100 ký tự",
         suggestion: "Vui lòng kiểm tra lại mã voucher",
         request: req,
      });
   }

   if (!voucher_discount_percentage || voucher_discount_percentage <= 0 || voucher_discount_percentage > 100) {
      throw new __RESPONSE.BadRequestError({
         message: "Phần trăm giảm giá không hợp lệ - Phải từ 1-100%",
         suggestion: "Vui lòng kiểm tra lại phần trăm giảm giá",
         request: req,
      });
   }

   if (!voucher_discount_max_amount || voucher_discount_max_amount < 0) {
      throw new __RESPONSE.BadRequestError({
         message: "Số tiền giảm tối thiểu không hợp lệ - Phải lớn hơn 0",
         suggestion: "Vui lòng kiểm tra lại số tiền giảm tối thiểu",
         request: req,
      });
   }

   if (!voucher_usage_limit || voucher_usage_limit <= 0) {
      throw new __RESPONSE.BadRequestError({
         message: "Số lượt sử dụng không hợp lệ - Phải lớn hơn 0",
         suggestion: "Vui lòng kiểm tra lại số lượt sử dụng",
         request: req,
      });
   }

   if (!voucher_valid_from || !voucher_valid_to || new Date(voucher_valid_from) >= new Date(voucher_valid_to)) {
      throw new __RESPONSE.BadRequestError({
         message: "Thời gian hiệu lực không hợp lệ - Ngày bắt đầu phải trước ngày kết thúc",
         suggestion: "Vui lòng kiểm tra lại thời gian hiệu lực",
         request: req,
      });
   }

   if (!voucher_created_by) {
      throw new __RESPONSE.BadRequestError({
         message: "Thiếu thông tin người cập nhật",
         suggestion: "Vui lòng kiểm tra lại thông tin người cập nhật",
         request: req,
      });
   }

   const voucherExist = await db.Voucher.findOne({
      where: {
         voucher_code: voucher_code,
      },
   });

   if (!voucherExist) {
      throw new __RESPONSE.BadRequestError({
         message: "Mã voucher không tồn tại - Vui lòng kiểm tra và thử lại!",
         suggestion: "Vui lòng kiểm tra và sử dụng giá trị khác",
         request: req,
      });
   }

   return await db.Voucher.update(
      {
         voucher_code: voucher_code,
         voucher_discount_percentage: voucher_discount_percentage,
         voucher_discount_max_amount: voucher_discount_max_amount,
         voucher_usage_limit: voucher_usage_limit,
         voucher_valid_from: voucher_valid_from,
         voucher_valid_to: voucher_valid_to,
         voucher_updated_by: voucher_created_by,
      },
      {
         where: {
            voucher_id: voucher_id,
         },
      }
   )
      .then((voucher) => {
         if (!voucher) {
            throw new __RESPONSE.BadRequestError({
               message: "Cập nhật voucher thất bại - Kiểm tra lại voucher bạn nhé!",
               suggestion: "Please check your request",
               request: req,
            });
         }

         return {
            voucher,
         };
      })
      .catch((error) => {
         if (error.original && error.original.code === "ER_DUP_ENTRY") {
            throw new __RESPONSE.BadRequestError({
               message: "Không thể cập nhật voucher - Mã voucher đã tồn tại!",
               suggestion: "Vui lòng kiểm tra lại mã voucher",
               request: req,
            });
         }
         throw new __RESPONSE.BadRequestError({
            message: "Lỗi cập nhật voucher - Kiểm tra lại voucher bạn nhé!",
            suggestion: "Please check your request",
            request: req,
         });
      });
};

const deleteVoucher = async (req) => {
   const {voucher_code} = req.params;

   if (!voucher_code) {
      throw new __RESPONSE.BadRequestError({
         message: "Mã voucher là bắt buộc - Kiểm tra lại voucher bạn nhé!",
         suggestion: "Please check your request",
         request: req,
      });
   }

   const voucherExist = await db.Voucher.findOne({
      where: {
         voucher_code: voucher_code,
      },
   });
   if (!voucherExist) {
      throw new __RESPONSE.BadRequestError({
         message: "Mã voucher không tồn tại - Vui lòng kiểm tra và thử lại!",
         suggestion: "Vui lòng kiểm tra và sử dụng giá trị khác",
         request: req,
      });
   }

   return await db.Voucher.destroy({
      where: {
         voucher_code: voucher_code,
      },
   })
      .then((voucher) => {
         if (!voucher) {
            throw new __RESPONSE.BadRequestError({
               message: "Xóa voucher thất bại - Kiểm tra lại voucher bạn nhé!",
               suggestion: "Please check your request",
               request: req,
            });
         }
         return {
            voucher,
         };
      })
      .catch((error) => {
         throw new __RESPONSE.BadRequestError({
            message: "Lỗi xóa voucher - Kiểm tra lại voucher bạn nhé! " + error.message,
            suggestion: "Please check your request",
            request: req,
         });
      });
};

const getVouchersByCustomer = async (req) => {
   const {customer_id, phone} = req.query;

   // Kiểm tra điều kiện đầu vào
   if (!customer_id && !phone) {
      throw new __RESPONSE.BadRequestError({
         message: "Yêu cầu cung cấp customer_id hoặc số điện thoại!",
         suggestion: "Vui lòng kiểm tra lại thông tin",
         request: req,
      });
   }

   // Tạo câu query với JOIN và điều kiện
   const vouchers = await db.sequelize.query(
      `SELECT DISTINCT 
         v.*,
         c.customer_full_name,
         c.customer_phone
      FROM vouchers v
      INNER JOIN voucher_customers vc ON v.voucher_id = vc.voucher_id
      INNER JOIN customers c ON vc.customer_id = c.customer_id
      WHERE 
         v.voucher_usage_limit > 0
         AND v.deleted_at IS NULL
         AND vc.deleted_at IS NULL
         AND c.deleted_at IS NULL
         AND (c.customer_id = :customer_id OR c.customer_phone = :phone)
         AND v.voucher_valid_to >= NOW()
      ORDER BY v.created_at DESC`,
      {
         replacements: {
            customer_id: customer_id || null,
            phone: phone || null,
         },
         type: db.sequelize.QueryTypes.SELECT,
      }
   );

   if (!vouchers || vouchers.length === 0) {
      throw new __RESPONSE.NotFoundError({
         message: "Không tìm thấy voucher nào!",
         suggestion: "Vui lòng kiểm tra lại thông tin",
      });
   }

   return {
      vouchers,
      total: vouchers.length,
   };
};

module.exports = {
   getAllVouchers,
   getVoucherByCode,
   createVoucher,
   updateVoucher,
   deleteVoucher,
   getVouchersByCustomer,
};
