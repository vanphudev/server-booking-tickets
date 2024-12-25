const express = require("express");
const rootRouter = express.Router();

const __REPORT_CONTROLLER = require("../../controllers/reportController");
const asyncHandler = require("../../middlewares/handleError");

rootRouter.post("/get-report-by-trip", asyncHandler(__REPORT_CONTROLLER.getReportByTrip));
rootRouter.get("/get-booking-status-stats-by-month", asyncHandler(__REPORT_CONTROLLER.getBookingStatusStatsByMonth));
rootRouter.get(
   "/get-customer-registration-stats-by-month",
   asyncHandler(__REPORT_CONTROLLER.getCustomerRegistrationStatsByMonth)
);
rootRouter.get("/get-customer-type-stats-by-month", asyncHandler(__REPORT_CONTROLLER.getCustomerTypeStatsByMonth));
rootRouter.get("/get-monthly-revenue-stats", asyncHandler(__REPORT_CONTROLLER.getMonthlyRevenueStats));
rootRouter.get("/get-monthly-refund-stats", asyncHandler(__REPORT_CONTROLLER.getMonthlyRefundStats));

module.exports = rootRouter;
