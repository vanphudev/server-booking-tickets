"use strict";

const __RESPONSE = require("../../core");
const {getAllVehicleImages, getVehicleImageById, getVehicleByVehicleId, createVehicleImage, deleteVehicleImage, findAllDeleteVehicleImages, updateVehicleImage
} = require("../../services/vehicleImageService");

const __VEHICLE_IMAGE_CONTROLLER = {
   createVehicleImage: async (req, res, next) => {
      new __RESPONSE.CREATED({
         message: "Create vehicle image successfully",
         metadata: await createVehicleImage(req, res, next),
         request: req,
      }).send(res);
   },
   getVehicleImageById: async (req, res, next) => {
      new __RESPONSE.UPDATE({
         message: "Vehicle updated",
         metadata: await getVehicleImageById(req),
         request: req,
      }).send(res);
   },
   getAllVehicleImages: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "List of all vehicle images",
         metadata: await getAllVehicleImages(),
         request: req,
      }).send(res);
   },
   updateVehicleImage: async (req, res, next) => {
      new __RESPONSE.UPDATE({
         message: "Vehicle updated",
         metadata: await updateVehicleImage(req),
         request: req,
      }).send(res);
   },
   deleteVehicleImage: async (req, res, next) => {
      new __RESPONSE.DELETE({
         message: "vehicle deleted",
         metadata: await deleteVehicleImage(req),
         request: req,
      }).send(res);
   },
   findAllDeleteVehicleImages: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "List of all deleted vehicle",
         metadata: await findAllDeleteVehicleImages(req),
         request: req,
      }).send(res);
   },
};

module.exports = __VEHICLE_IMAGE_CONTROLLER;
