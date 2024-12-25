const express = require("express");
const rootRouter = express.Router();
const __RESPONSE = require("../../core/errorResponse");
const __TYPE_VEHICLE_CONTROLLER = require("../../controllers/vehicleTypeController");
const asyncHandler = require("../../middlewares/handleError");
const {
   validateVehicleTypeWithByIDToQuery,
   validateCreateVehicleType,
   validateUpdateVehicleType,
} = require("../../middlewares/validates/vehicleTypeValidates");

rootRouter
   .get("/getall", asyncHandler(__TYPE_VEHICLE_CONTROLLER.getAllVehicleTypes))
   .get("/getalldeleted", asyncHandler(__TYPE_VEHICLE_CONTROLLER.findAllDeletedVehicleType))
   .put("/update", validateUpdateVehicleType, asyncHandler(__TYPE_VEHICLE_CONTROLLER.updateVehicleType))
   .get("/getbyid", validateVehicleTypeWithByIDToQuery, asyncHandler(__TYPE_VEHICLE_CONTROLLER.getVehicleTypeById))
   .post("/create", validateCreateVehicleType, asyncHandler(__TYPE_VEHICLE_CONTROLLER.createVehicleType))
   .delete("/delete", validateVehicleTypeWithByIDToQuery, asyncHandler(__TYPE_VEHICLE_CONTROLLER.deleteVehicleType));

module.exports = rootRouter;
