const express = require("express");
const rootRouter = express.Router();

const __MAP_VEHICLElAYOUT = require("../../controllers/mapVehicleLayoutController");
const asyncHandler = require("../../middlewares/handleError");

rootRouter.post("/create", asyncHandler(__MAP_VEHICLElAYOUT.createMapVehicleLayout));
rootRouter.put("/update/:id", asyncHandler(__MAP_VEHICLElAYOUT.updateMapVehicleLayout));
rootRouter.delete("/delete/:id", asyncHandler(__MAP_VEHICLElAYOUT.deleteMapVehicleLayout));

module.exports = rootRouter;
