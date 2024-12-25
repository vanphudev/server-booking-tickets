const express = require("express");
const rootRouter = express.Router();
const __RESPONSE = require("../../core/errorResponse");
const __VEHICLE_CONTROLLER = require("../../controllers/vehicleController");
const asyncHandler = require("../../middlewares/handleError");

rootRouter.get("/getall", asyncHandler(__VEHICLE_CONTROLLER.getAllVehicles));

module.exports = rootRouter;
