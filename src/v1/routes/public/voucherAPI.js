const express = require("express");
const voucherRouter = express.Router();
const asyncHandler = require("../../middlewares/handleError");
const __VOUCHER_CONTROLLER__ = require("../../controllers/voucherController");

voucherRouter.get("/getByCode", asyncHandler(__VOUCHER_CONTROLLER__.getVoucherByCode));
voucherRouter.get("/getByCustomer", asyncHandler(__VOUCHER_CONTROLLER__.getVouchersByCustomer));
module.exports = voucherRouter;
