const express = require("express");
const rootRouter = express.Router();
const __RESPONSE = require("../../core/errorResponse");
const __BOOKING_TICKETS_CONTROLLER = require("../../controllers/bookingTiketsController");
const asyncHandler = require("../../middlewares/handleError");

rootRouter.post("/create", asyncHandler(__BOOKING_TICKETS_CONTROLLER.createBookingTickets));
rootRouter.get("/check", asyncHandler(__BOOKING_TICKETS_CONTROLLER.checkBookingStatus));
rootRouter.put("/update", asyncHandler(__BOOKING_TICKETS_CONTROLLER.updateBookingAfterPayment));
rootRouter.get("/getpaymentvnpayurl", asyncHandler(__BOOKING_TICKETS_CONTROLLER.getPaymenVNPaytUrl));
rootRouter.get("/getbookingdetails", asyncHandler(__BOOKING_TICKETS_CONTROLLER.getBookingDetailsByCode));
rootRouter.put("/cancel", asyncHandler(__BOOKING_TICKETS_CONTROLLER.cancelBooking));
rootRouter.put("/updateafterpayment", asyncHandler(__BOOKING_TICKETS_CONTROLLER.updateBookingAfterPaymentVNPay));
rootRouter.get("/getinfobooking", asyncHandler(__BOOKING_TICKETS_CONTROLLER.getInfoBookingTiketsSuccess));
rootRouter.get("/searchtickets", asyncHandler(__BOOKING_TICKETS_CONTROLLER.searchTicket));
rootRouter.get("/count", asyncHandler(__BOOKING_TICKETS_CONTROLLER.countBookingTickets));

module.exports = rootRouter;
