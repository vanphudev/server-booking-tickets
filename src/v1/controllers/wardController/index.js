"use strict";

const __RESPONSE = require("../../core/");

const {getAllWards, getWardsByIdDistrict} = require("../../services/wardService");

const __WARD_CONTROLLER = {
   getWards: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "List of all wards",
         metadata: await getAllWards(req),
         request: req,
      }).send(res);
   },
   getWardsByIdDistrict: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "List of wards by district",
         metadata: await getWardsByIdDistrict(req),
         request: req,
      }).send(res);
   },
};

module.exports = __WARD_CONTROLLER;
