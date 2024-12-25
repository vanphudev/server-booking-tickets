const express = require("express");
const rootRouter = express.Router();
const __ROUTES_CONTROLLER = require("../../controllers/routesController/");
const asyncHandler = require("../../middlewares/handleError");
const {
   validateCreateRoute,
   validateUpdateRoute,
} = require("../../middlewares/validates/routesValidates.js");

rootRouter.get("/get-all-routes-admin", asyncHandler(__ROUTES_CONTROLLER.getAllRouter_Admin));
rootRouter.post("/create-route", validateCreateRoute, asyncHandler(__ROUTES_CONTROLLER.createRoute));
rootRouter.put("/update-route", validateUpdateRoute, asyncHandler(__ROUTES_CONTROLLER.updateRoute));
rootRouter.delete("/delete-route/:route_id", asyncHandler(__ROUTES_CONTROLLER.deleteRoute));

module.exports = rootRouter;
