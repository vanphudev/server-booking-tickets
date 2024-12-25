const express = require("express");
const rootRouter = express.Router();

const __MAP_VEHICLE_SEAT_CONTROLLER = require("../../controllers/mapVehicleSeatController");
const asyncHandler = require("../../middlewares/handleError");

rootRouter.post("/create", asyncHandler(__MAP_VEHICLE_SEAT_CONTROLLER.createMapVehicleSeat));
rootRouter.put("/update/:id", asyncHandler(__MAP_VEHICLE_SEAT_CONTROLLER.updateMapVehicleSeat)); 
rootRouter.delete("/delete/:id", asyncHandler(__MAP_VEHICLE_SEAT_CONTROLLER.deleteMapVehicleSeat));

rootRouter.get("/all", asyncHandler(__MAP_VEHICLE_SEAT_CONTROLLER.getAllMapVehicleSeat)); 
rootRouter.get("/:id", asyncHandler(__MAP_VEHICLE_SEAT_CONTROLLER.getMapVehicleSeatById));

module.exports = rootRouter;
