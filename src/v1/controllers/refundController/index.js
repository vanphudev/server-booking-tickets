"use strict";

const __RESPONSE = require("../../core/");
const {refund, get_refund_all, get_refund_today, get_refund_no_approved, approve_refund} = require("../../services/refundService");

const __REFUND_CONTROLLER = {
   refund: async (req, res, next) => {
      new __RESPONSE.CREATED({
         message: "Yêu cầu hoàn vé đã được gửi đi thành công!",
         metadata: await refund(req),
         request: req,
      }).send(res);
   },
   get_refund_all: async (req, res, next) => {
      new __RESPONSE.OK({
         message: "Lấy danh sách hoàn vé thành công!",
         metadata: await get_refund_all(),
         request: req,
      }).send(res);
   },
   get_refund_today: async (req, res, next) => {
      new __RESPONSE.OK({
         message: "Lấy danh sách hoàn vé hôm nay thành công!",
         metadata: await get_refund_today(),
         request: req,
      }).send(res);
   },
   get_refund_no_approved: async (req, res, next) => {
      new __RESPONSE.OK({
         message: "Lấy danh sách hoàn vé chưa được duyệt thành công!",
         metadata: await get_refund_no_approved(),
         request: req,
      }).send(res);
   },
   approve_refund: async (req, res, next) => {
      new __RESPONSE.OK({
         message: "Duyệt hoàn vé thành công!",
         metadata: await approve_refund(req),
         request: req,
      }).send(res);
   },
};

module.exports = __REFUND_CONTROLLER;
