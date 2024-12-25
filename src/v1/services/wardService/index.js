"use strict";

const {validationResult} = require("express-validator");
const __RESPONSE = require("../../core/");
const db = require("../../models");

const getAllWards = async (req) => {
   return await db.Ward.findAll({
      attributes: ["ward_id", "ward_name", "district_id"],
      order: [["ward_name", "ASC"]],
   })
      .then((wards) => {
         if (!wards) {
            throw new __RESPONSE.NotFoundError({
               message: "Wards not found",
               suggestion: "Please check your request",
               request: req,
            });
         }
         return {
            wards: wards,
            total: wards.length,
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

const getWardsByIdDistrict = async (req) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      throw new __RESPONSE.BadRequestError({
         message: "Validation failed " + errors.array()[0]?.msg + " !",
         suggestion: "Please provide the correct data",
         request: req,
      });
   }
   const {districtId} = req.params;
   return await db.Ward.findAll({
      where: {
         district_id: districtId,
      },
      attributes: ["ward_id", "ward_name"],
      order: [["ward_name", "ASC"]],
   })
      .then((wards) => {
         if (!wards) {
            throw new __RESPONSE.NotFoundError({
               message: "Wards not found",
               suggestion: "Please check your request",
               request: req,
            });
         }
         return {
            wards: wards,
            total: wards.length,
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

module.exports = {
   getAllWards,
   getWardsByIdDistrict,
};
