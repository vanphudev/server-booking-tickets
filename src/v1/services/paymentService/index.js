"use strict";
const __RESPONSE = require("../../core");
const {validationResult} = require("express-validator");
const db = require("../../models");

const getAllPaymentMethod = async (req, res) => {
   return await db.PaymentMethod.findAll()
      .then((payments) => {
         if (payments.length === 0 || !payments) {
            throw new __RESPONSE.NotFoundError({
               message: "Không tìm thấy phương thức thanh toán nào!",
               suggestion: "Vui lòng kiểm tra lại yêu cầu",
               request: req,
            });
         }
         return {
            payments,
            total: payments.length,
         };
      })
      .catch((error) => {
         throw new __RESPONSE.InternalServerError({
            message: "Lỗi khi lấy danh sách phương thức thanh toán!",
            suggestion: "Vui lòng kiểm tra lại yêu cầu",
            request: req,
         });
      });
};

module.exports = {
   getAllPaymentMethod,
};
