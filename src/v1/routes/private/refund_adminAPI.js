const express = require("express");
const rootRouter = express.Router();
const __RESPONSE = require("../../core/errorResponse");
const __REFUND_CONTROLLER__ = require("../../controllers/refundController");
const asyncHandler = require("../../middlewares/handleError");

rootRouter.get("/refund-all", asyncHandler(__REFUND_CONTROLLER__.get_refund_all));
rootRouter.get("/refund-today", asyncHandler(__REFUND_CONTROLLER__.get_refund_today));
rootRouter.get("/refund-no-approved", asyncHandler(__REFUND_CONTROLLER__.get_refund_no_approved));
rootRouter.post("/approve-refund", asyncHandler(__REFUND_CONTROLLER__.approve_refund));

module.exports = rootRouter;