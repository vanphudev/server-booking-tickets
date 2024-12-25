"use strict";

const __RESPONSE = require("../../core/");
const {getProvincesAll, getProvincesById} = require("../../services/provinceService");

const __PROVINCE_CONTROLLER = {
   getProvinces: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "List of all provinces",
         metadata: await getProvincesAll(req),
         request: req,
      }).send(res);
   },
   getProvinceById: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "Get province by id",
         metadata: await getProvincesById(req),
         request: req,
      }).send(res);
   },
};

module.exports = __PROVINCE_CONTROLLER;
