const express = require("express");
const rootRouter = express.Router();
const __VEHICLE_IMAGE_CONTROLLER = require("../../controllers/vehicleImageController");
const asyncHandler = require("../../middlewares/handleError");

const {
   validateCreateVehicleImage,
   validateUpdateVehicleImage,
   validateVehicleImageWithByIDToQuery,
} = require("../../middlewares/validates/vehicleImageValidates");
const {createUploadMiddleware} = require("../../utils/uploadImages");

const __FOLDER__ = "vehicle_images";
const __MAX_FILES__ = 5;

const vehicleImageUpload = createUploadMiddleware({
   maxFiles: __MAX_FILES__,
   customFolder: __FOLDER__,
});

rootRouter
   .get("/getall", asyncHandler(__VEHICLE_IMAGE_CONTROLLER.getAllVehicleImages))
   .get("/getalldeleted", asyncHandler(__VEHICLE_IMAGE_CONTROLLER.findAllDeleteVehicleImages))
   .get("/getbyid",validateVehicleImageWithByIDToQuery , asyncHandler(__VEHICLE_IMAGE_CONTROLLER.getVehicleImageById))
   .put("/update", validateUpdateVehicleImage, asyncHandler(__VEHICLE_IMAGE_CONTROLLER.updateVehicleImage))
   .get("/getbyid", validateVehicleImageWithByIDToQuery, asyncHandler(__VEHICLE_IMAGE_CONTROLLER.getVehicleImageById))
   .post(
      "/create/:vehicleId",
      validateCreateVehicleImage,
      asyncHandler(__VEHICLE_IMAGE_CONTROLLER.getVehicleByVehicleId),
      vehicleImageUpload,
      validateCreateVehicleImage,
      asyncHandler(__VEHICLE_IMAGE_CONTROLLER.createVehicleImage)
   )
   .delete("/delete", validateVehicleImageWithByIDToQuery, asyncHandler(__VEHICLE_IMAGE_CONTROLLER.deleteVehicleImage));

module.exports = rootRouter;
