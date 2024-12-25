const express = require("express");
const rootRouter = express.Router();
const __RESPONSE = require("../../core/errorResponse");
const __VEHICLE_CONTROLLER = require("../../controllers/vehicleController");
const asyncHandler = require("../../middlewares/handleError");
const {
   validateCreateVehicle,
   validateUpdateVehicle,
} = require("../../middlewares/validates/vehicleValidates");

rootRouter
   .get("/getLayoutVehicle", asyncHandler(__VEHICLE_CONTROLLER.getLayoutVehicle))
   .get("/getVehicleType", asyncHandler(__VEHICLE_CONTROLLER.getVehicleType))
   .post("/create", validateCreateVehicle, asyncHandler(__VEHICLE_CONTROLLER.createVehicle))
   .put("/update", validateUpdateVehicle, asyncHandler(__VEHICLE_CONTROLLER.updateVehicle))
   .delete("/delete/:vehicle_id", asyncHandler(__VEHICLE_CONTROLLER.deleteVehicle));


module.exports = rootRouter;
