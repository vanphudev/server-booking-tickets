"use strict";

const __RESPONSE = require("../../core/");
const {
   getReportByTrip,
   getBookingStatusStatsByMonth,
   getCustomerRegistrationStatsByMonth,
   getCustomerTypeStatsByMonth,
   getMonthlyRevenueStats,
   getMonthlyRefundStats,
} = require("../../services/reportService");

const __REPORT_CONTROLLER = {
   getReportByTrip: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "Lấy báo cáo thành công!",
         metadata: await getReportByTrip(req),
         request: req,
      }).send(res);
   },
   getBookingStatusStatsByMonth: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "Lấy báo cáo thành công!",
         metadata: await getBookingStatusStatsByMonth(req),
         request: req,
      }).send(res);
   },
   getCustomerRegistrationStatsByMonth: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "Lấy báo cáo thành công!",
         metadata: await getCustomerRegistrationStatsByMonth(req),
         request: req,
      }).send(res);
   },
   getCustomerTypeStatsByMonth: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "Lấy báo cáo thành công!",
         metadata: await getCustomerTypeStatsByMonth(req),
         request: req,
      }).send(res);
   },
   getMonthlyRevenueStats: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "Lấy báo cáo thành công!",
         metadata: await getMonthlyRevenueStats(req),
         request: req,
      }).send(res);
   },
   getMonthlyRefundStats: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "Lấy báo cáo thành công!",
         metadata: await getMonthlyRefundStats(req),
         request: req,
      }).send(res);
   },
};

module.exports = __REPORT_CONTROLLER;
