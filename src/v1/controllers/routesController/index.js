"use strict";
const __RESPONSE = require("../../core/");
const {
   getAllRoutes,
   getTrips,
   getRouteReviews,
   getRoutePickupPoints,
   addWayPickupPoints,
   getAllRouter_Admin,
   createRoute,
   updateRoute,
   deleteRoute
} = require("../../services/routesService");

const __ROUTES_CONTROLLER = {
   getRoutes: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "List of all routes",
         metadata: await getAllRoutes(req),
         request: req,
      }).send(res);
   },
   getTrips: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "List of all trips",
         metadata: await getTrips(req),
         request: req,
      }).send(res);
   },
   getRouteReviews: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "List of all reviews",
         metadata: await getRouteReviews(req.query.routeId),
         request: req,
      }).send(res);
   },
   getRoutePickupPoints: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "List of all pickup points",
         metadata: await getRoutePickupPoints(req.query.routeId),
         request: req,
      }).send(res);
   },
   addWayPickupPoints: async (req, res, next) => {
      new __RESPONSE.POST({
         message: "Way pickup points added successfully",
         metadata: await addWayPickupPoints(req),
         request: req,
      }).send(res);
   },
   getAllRouter_Admin: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "List of all routes",
         metadata: await getAllRouter_Admin(),
         request: req,
      }).send(res);
   },
   createRoute: async (req, res, next) => {
      new __RESPONSE.CREATED({
         message: "Route created successfully",
         metadata: await createRoute(req),
         request: req,
      }).send(res);
   },
   updateRoute: async (req, res, next) => {
      new __RESPONSE.UPDATE({
         message: "Route updated successfully",
         metadata: await updateRoute(req),
         request: req,
      }).send(res);
   },
   deleteRoute: async (req, res, next) => {
      new __RESPONSE.DELETE({
         message: "Route deleted successfully",
         metadata: await deleteRoute(req),
         request: req,
      }).send(res);
   }
};

module.exports = __ROUTES_CONTROLLER;
