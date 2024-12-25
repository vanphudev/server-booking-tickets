const express = require("express");
const voucherRouter = express.Router();
const asyncHandler = require("../../middlewares/handleError");
const __VOUCHER_CONTROLLER__ = require("../../controllers/voucherController");

voucherRouter.get("/getall", asyncHandler(__VOUCHER_CONTROLLER__.getAllVouchers));
voucherRouter.post("/create", asyncHandler(__VOUCHER_CONTROLLER__.createVoucher));
voucherRouter.put("/update", asyncHandler(__VOUCHER_CONTROLLER__.updateVoucher));
voucherRouter.delete("/delete/:voucher_code", asyncHandler(__VOUCHER_CONTROLLER__.deleteVoucher));

module.exports = voucherRouter;
