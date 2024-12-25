const express = require("express");
const rootRouter = express.Router();
const __PAYMENT_METHOD_CONTROLLER = require("../../controllers/paymentMethodController/");
const asyncHandler = require("../../middlewares/handleError");

rootRouter.get("/get-all-payment-method", asyncHandler(__PAYMENT_METHOD_CONTROLLER.getAllPaymentMethod));

module.exports = rootRouter;
