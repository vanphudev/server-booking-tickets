const express = require("express");
const rootRouter = express.Router();
const __RESPONSE = require("../../core/errorResponse");
const __ROUTES_CONTROLLER = require("../../controllers/routesController");
const asyncHandler = require("../../middlewares/handleError");
const { validateTrips } = require("../../middlewares/validates/tripsValidates");

rootRouter.get("/getall", asyncHandler(__ROUTES_CONTROLLER.getRoutes));
const url = `/gettrips`;
rootRouter.get(url, validateTrips, asyncHandler(__ROUTES_CONTROLLER.getTrips));
rootRouter.get("/getroutereviews", asyncHandler(__ROUTES_CONTROLLER.getRouteReviews));
rootRouter.get("/getroutepickuppoints", asyncHandler(__ROUTES_CONTROLLER.getRoutePickupPoints));

module.exports = rootRouter;
