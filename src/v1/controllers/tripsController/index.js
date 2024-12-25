"use strict";
const __RESPONSE = require("../../core/");
const {
   getAllTrip,
   createTrip,
   updateTrip,
   deleteTrip,
   updateTicketPriceAdvance,
   countTrip,
} = require("../../services/tripService");

const __TRIPS_CONTROLLER = {
   getAllTrip: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "Trip fetched successfully",
         metadata: await getAllTrip(req),
         request: req,
      }).send(res);
   },
   createTrip: async (req, res, next) => {
      new __RESPONSE.CREATED({
         message: "Trip created successfully",
         metadata: await createTrip(req),
         request: req,
      }).send(res);
   },
   updateTrip: async (req, res, next) => {
      new __RESPONSE.UPDATE({
         message: "Trip updated successfully",
         metadata: await updateTrip(req),
         request: req,
      }).send(res);
   },
   deleteTrip: async (req, res, next) => {
      new __RESPONSE.DELETE({
         message: "Trip deleted successfully",
         metadata: await deleteTrip(req),
         request: req,
      }).send(res);
   },
   updateTicketPriceAdvance: async (req, res, next) => {
      new __RESPONSE.UPDATE({
         message: "Ticket price updated successfully",
         metadata: await updateTicketPriceAdvance(req),
         request: req,
      }).send(res);
   },
   countTrip: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "Count of trips",
         metadata: await countTrip(),
         request: req,
      }).send(res);
   },
};

module.exports = __TRIPS_CONTROLLER;
