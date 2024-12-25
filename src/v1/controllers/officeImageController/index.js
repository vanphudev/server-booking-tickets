"use strict";

const __RESPONSE = require("../../core");
const {
   getAllOfficeImages,
   getOfficeImageById,
   createOfficeImage,
   getOfficeByOfficeId,
   updateOfficeImage,
   deleteAllOfficeImages,
} = require("../../services/officeImageService");

const __OFFICE_IMAGE_CONTROLLER__ = {
   createOfficeImage: async (req, res, next) => {
      new __RESPONSE.CREATED({
         message: "Create office image successfully",
         metadata: await createOfficeImage(req, res, next),
         request: req,
      }).send(res);
   },
   getOfficeByOfficeId: async (req, res, next) => {
      req.office = await getOfficeByOfficeId(req, res, next);
      next();
   },
   getAllOfficeImages: async (req, res, next) => {
      new __RESPONSE.SUCCESS({
         message: "Get all office images successfully",
         metadata: await getAllOfficeImages(req, res, next),
         request: req,
      }).send(res);
   },
   getOfficeImageById: async (req, res, next) => {
      new __RESPONSE.SUCCESS({
         message: "Get office image by id successfully",
         metadata: await getOfficeImageById(req, res, next),
         request: req,
      }).send(res);
   },
   updateOfficeImage: async (req, res, next) => {
      new __RESPONSE.SUCCESS({
         message: "Update office image successfully",
         metadata: await updateOfficeImage(req, res, next),
         request: req,
      }).send(res);
   },
   deleteOfficeImage: async (req, res, next) => {
      new __RESPONSE.SUCCESS({
         message: "Delete office image successfully",
         metadata: await deleteAllOfficeImages(req, res, next),
         request: req,
      }).send(res);
   },
};

module.exports = __OFFICE_IMAGE_CONTROLLER__;
