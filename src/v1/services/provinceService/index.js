"use strict";
const __RESPONSE = require("../../core");
const {validationResult} = require("express-validator");
const db = require("../../models");

const getProvincesAll = async (req) => {
   return await db.Province.findAll({
      attributes: ["province_id", "province_name"],
      order: [["province_name", "ASC"]],
   })
      .then((result) => {
         if (!result) {
            throw new __RESPONSE.NotFoundError({
               message: "Not found provinces!",
               suggestion: "Please check again your request",
               request: req,
            });
         }
         return {
            provinces: result,
            total: result.length,
         };
      })
      .catch((err) => {
         if (err instanceof __RESPONSE.NotFoundError) {
            throw err;
         }
         throw new __RESPONSE.InternalServerError({
            message: "Error get provinces",
            suggestion: "Please check again your request",
            request: req,
         });
      });
};

const getProvincesById = async (req) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      throw new __RESPONSE.BadRequestError({
         message: "Validation failed " + errors.array()[0]?.msg + " !",
         suggestion: "Please provide the correct data",
         request: req,
      });
   }
   const {provinceId} = req.params;
   return await db.Province.findOne({
      where: {province_id: provinceId},
      attributes: ["province_id", "province_name"],
   })
      .then((result) => {
         if (!result) {
            throw new __RESPONSE.NotFoundError({
               message: "Not found province!",
               suggestion: "Please check again your request",
               request: req,
            });
         }
         return {
            province: result,
         };
      })
      .catch((err) => {
         if (err instanceof __RESPONSE.NotFoundError) {
            throw err;
         }
         throw new __RESPONSE.InternalServerError({
            message: "Error get province",
            suggestion: "Please check again your request",
            request: req,
         });
      });
};

module.exports = {getProvincesAll, getProvincesById};
