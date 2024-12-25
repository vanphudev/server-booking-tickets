"use strict";
const {validationResult} = require("express-validator");
const __RESPONSE = require("../../core");
const db = require("../../models");

const getDistrictsByIdProvince = async (req) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      throw new __RESPONSE.BadRequestError({
         message: "Validation failed " + errors.array()[0]?.msg + " !",
         suggestion: "Please provide the correct data",
         request: req,
      });
   }
   const {provinceId} = req.params;
   return await db.District.findAll({
      where: {
         province_id: provinceId,
      },
      attributes: ["district_id", "district_name"],
      order: [["district_name", "ASC"]],
   })
      .then((districts) => {
         if (!districts) {
            throw new __RESPONSE.NotFoundError({
               message: "Districts not found",
               suggestion: "Please check your request",
               request: req,
            });
         }
         return {
            districts,
            total: districts.length,
         };
      })
      .catch((error) => {
         if (error instanceof __RESPONSE.NotFoundError) {
            throw error;
         }
         throw new __RESPONSE.BadRequestError({
            message: error.message,
            suggestion: "Please check your request",
         });
      });
};

const getDistrictsAll = async (req) => {
   return await db.District.findAll({
      attributes: ["district_id", "district_name", "province_id"],
      order: [["district_name", "ASC"]],
   })
      .then((result) => {
         if (!result) {
            throw new __RESPONSE.NotFoundError({
               message: "Districts not found",
               suggestion: "Please check your request",
               request: req,
            });
         }
         return {
            districts: result,
            total: result.length,
         };
      })
      .catch((err) => {
         if (err instanceof __RESPONSE.NotFoundError) {
            throw err;
         }
         throw new __RESPONSE.BadRequestError({
            message: err.message,
            suggestion: "Please check your request",
         });
      });
};

module.exports = {
   getDistrictsAll,
   getDistrictsByIdProvince,
};
