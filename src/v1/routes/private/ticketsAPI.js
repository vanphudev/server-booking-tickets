const express = require("express");
const rootRouter = express.Router();
const __BOOKING_TICKETS_CONTROLLER = require("../../controllers/bookingTiketsController/");
const asyncHandler = require("../../middlewares/handleError");

rootRouter.get("/get-customer-tickets", asyncHandler(__BOOKING_TICKETS_CONTROLLER.getCustomerTickets));
rootRouter.get("/get-customer-tickets-refund", asyncHandler(__BOOKING_TICKETS_CONTROLLER.getCustomerTicketsRefund));

module.exports = rootRouter;
