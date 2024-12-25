"use strict";

const __RESPONSE = require("../../core");
const {getDistrictsAll, getDistrictsByIdProvince} = require("../../services/districtService");

const __DISTRICT_CONTROLLER = {
   getDistricts: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "List of all districts",
         metadata: await getDistrictsAll(req),
         request: req,
      }).send(res);
   },
   getDistrictsByIdProvince: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "List of districts by province",
         metadata: await getDistrictsByIdProvince(req),
         request: req,
      }).send(res);
   },
};

module.exports = __DISTRICT_CONTROLLER;
