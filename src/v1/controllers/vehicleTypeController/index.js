"use strict";

const __RESPONSE = require("../../core");
const {getAllVehicleTypes, getVehicleTypeById, createVehicleType, updateVehicleType, deleteVehicleType, findAllDeletedVehicleType} = require("../../services/typeVehicleService");

const __TYPE_VEHICLE_CONTROLLER = {
   getAllVehicleTypes: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "List of all vehicle types",
         metadata: await getAllVehicleTypes(),
         request: req,
      }).send(res);
   },
   getVehicleTypeById: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "Vehicle type details",
         metadata: await getVehicleTypeById(req),
         request: req,
      }).send(res);
   },
   createVehicleType: async (req, res, next) => {
      new __RESPONSE.CREATED({
         message: "Vehicle type created",
         metadata: await createVehicleType(req),
         request: req,
      }).send(res);
   },
   updateVehicleType: async (req, res, next) => {
      new __RESPONSE.UPDATE({
         message: "Vehicle updated",
         metadata: await updateVehicleType(req),
         request: req,
      }).send(res);
   },
   deleteVehicleType: async (req, res, next) => {
      new __RESPONSE.DELETE({
         message: "Vehicle typedeleted",
         metadata: await deleteVehicleType(req),
         request: req,
      }).send(res);
   },
   findAllDeletedVehicleType: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "List of all deleted vehicle types",
         metadata: await findAllDeletedVehicleType(req),
         request: req,
      }).send(res);
   },
};

module.exports = __TYPE_VEHICLE_CONTROLLER;
