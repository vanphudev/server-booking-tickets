"use strict";

const __RESPONSE = require("../../core");
const {getAllPaymentMethod} = require("../../services/paymentService");

const __PAYMENT_METHOD_CONTROLLER = {
   getAllPaymentMethod: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "Danh sách phương thức thanh toán",
         metadata: await getAllPaymentMethod(req, res),
         request: req,
      }).send(res, next);
   },
};

module.exports = __PAYMENT_METHOD_CONTROLLER;
