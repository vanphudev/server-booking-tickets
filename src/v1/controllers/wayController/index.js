"use strict";

const __RESPONSE = require("../../core");
const {
   getAllWays,
   getWayById,
   createWay,
   updateWay,
   deleteWay,
} = require("../../services/wayService");

const __WAY_CONTROLLER = {
   getAllWays: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "List of all ways",
         metadata: await getAllWays(req),
         request: req,
      }).send(res);
   },

   getWayById: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "Way by ID",
         metadata: await getWayById(req),
         request: req,
      }).send(res);
   },

   createWay: async (req, res, next) => {
      new __RESPONSE.CREATED({
         message: "Way created",
         metadata: await createWay(req),
         request: req,
      }).send(res);
   },

   updateWay: async (req, res, next) => {
      new __RESPONSE.UPDATE({
         message: "Way updated",
         metadata: await updateWay(req),
         request: req,
      }).send(res);
   },

   deleteWay: async (req, res, next) => {
      new __RESPONSE.DELETE({
         message: "Way deleted",
         metadata: await deleteWay(req),
         request: req,
      }).send(res);
   },

};

module.exports = __WAY_CONTROLLER;
