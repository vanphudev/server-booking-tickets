"use strict";
const __RESPONSE = require("../../core");

const {
   createBookingTickets,
   checkBookingStatus,
   updateBookingAfterPayment,
   getPaymenVNPaytUrl,
   getBookingDetailsByCode,
   cancelBooking,
   updateBookingAfterPaymentVNPay,
   getInfoBookingTiketsSuccess,
   searchTicket,
   getCustomerTickets,
   getCustomerTicketsRefund,
   countBookingTickets,
} = require("../../services/bookingTiketsService");

const __BOOKING_TICKETS_CONTROLLER = {
   createBookingTickets: async (req, res, next) => {
      new __RESPONSE.CREATED({
         message: "Create booking tickets successfully !",
         metadata: await createBookingTickets(req.body),
      }).send(res);
   },
   checkBookingStatus: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "Check booking status successfully !",
         metadata: await checkBookingStatus(req.query.bookingCode),
      }).send(res);
   },
   updateBookingAfterPayment: async (req, res, next) => {
      new __RESPONSE.OK({
         message: "Update booking after payment successfully !",
         metadata: await updateBookingAfterPayment(req.body),
      }).send(res);
   },
   getPaymenVNPaytUrl: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "Get payment VNPay url successfully !",
         metadata: await getPaymenVNPaytUrl(req),
      }).send(res);
   },
   getBookingDetailsByCode: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "Get booking details by code successfully !",
         metadata: await getBookingDetailsByCode(req.query.bookingCode),
      }).send(res);
   },
   cancelBooking: async (req, res, next) => {
      new __RESPONSE.OK({
         message: "Cancel booking successfully !",
         metadata: await cancelBooking(req),
      }).send(res);
   },
   updateBookingAfterPaymentVNPay: async (req, res, next) => {
      new __RESPONSE.OK({
         message: "Update booking after payment VNPay successfully !",
         metadata: await updateBookingAfterPaymentVNPay(req),
      }).send(res);
   },
   getInfoBookingTiketsSuccess: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "Get info booking tickets success !",
         metadata: await getInfoBookingTiketsSuccess(req.query.bookingCode),
      }).send(res);
   },
   searchTicket: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "Search ticket successfully !",
         metadata: await searchTicket(req.query.ticketCode, req.query.customerPhone),
      }).send(res);
   },
   getCustomerTickets: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "Get customer tickets successfully !",
         metadata: await getCustomerTickets(req.query.customerPhone),
      }).send(res);
   },
   getCustomerTicketsRefund: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "Get customer tickets refund successfully !",
         metadata: await getCustomerTicketsRefund(req.query.customerPhone),
      }).send(res);
   },
   countBookingTickets: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "Count booking tickets successfully !",
         metadata: await countBookingTickets(),
      }).send(res);
   },
};

module.exports = __BOOKING_TICKETS_CONTROLLER;
