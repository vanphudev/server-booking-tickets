"use strict";

const __RESPONSE = require("../../core");
const {
   getAllVouchers,
   getVoucherByCode,
   createVoucher,
   updateVoucher,
   deleteVoucher,
} = require("../../services/voucherService");

const __VOUCHER_CONTROLLER = {
   getAllVouchers: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "List of all vouchers",
         metadata: await getAllVouchers(),
         request: req,
      }).send(res);
   },
   getVoucherByCode: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "Voucher information",
         metadata: await getVoucherByCode(req),
         request: req,
      }).send(res);
   },
   createVoucher: async (req, res, next) => {
      new __RESPONSE.POST({
         message: "Voucher created",
         metadata: await createVoucher(req),
         request: req,
      }).send(res);
   },
   updateVoucher: async (req, res, next) => {
      new __RESPONSE.PUT({
         message: "Voucher updated",
         metadata: await updateVoucher(req),
         request: req,
      }).send(res);
   },

   deleteVoucher: async (req, res, next) => {
      new __RESPONSE.DELETE({
         message: "Voucher deleted",
         metadata: await deleteVoucher(req),
         request: req,
      }).send(res);
   },
};

module.exports = __VOUCHER_CONTROLLER;
