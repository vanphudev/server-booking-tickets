"use strict";

const __RESPONSE = require("../../core");
const {
   getAllVehicles,
   updateVehicle,
   deleteVehicle,
   createVehicle,
   getLayoutVehicle,
   getVehicleType,
} = require("../../services/vehicleService");

const __VEHICLE_CONTROLLER = {
   getAllVehicles: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "List of all vehicles",
         metadata: await getAllVehicles(req),
         request: req,
      }).send(res);
   },
   getLayoutVehicle: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "List of all vehicle layouts",
         metadata: await getLayoutVehicle(req),
         request: req,
      }).send(res);
   },
   getVehicleType: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "List of all vehicle types",
         metadata: await getVehicleType(req),
         request: req,
      }).send(res);
   },
   createVehicle: async (req, res, next) => {
      new __RESPONSE.CREATED({
         message: "Vehicle created",
         metadata: await createVehicle(req),
         request: req,
      }).send(res);
   },
   updateVehicle: async (req, res, next) => {
      new __RESPONSE.UPDATE({
         message: "Vehicle updated",
         metadata: await updateVehicle(req),
         request: req,
      }).send(res);
   },
   deleteVehicle: async (req, res, next) => {
      new __RESPONSE.DELETE({
         message: "Vehicle deleted",
         metadata: await deleteVehicle(req),
         request: req,
      }).send(res);
   },
};

module.exports = __VEHICLE_CONTROLLER;
