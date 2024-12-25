const express = require("express");
const rootRouter = express.Router();
const __TRIPS_CONTROLLER = require("../../controllers/tripsController");
const asyncHandler = require("../../middlewares/handleError");
const {validateCreateTrips, validateUpdateTrips} = require("../../middlewares/validates/tripsValidates");

rootRouter.get("/get-all-trips", asyncHandler(__TRIPS_CONTROLLER.getAllTrip));
rootRouter.post("/create-trip", validateCreateTrips, asyncHandler(__TRIPS_CONTROLLER.createTrip));
rootRouter.put("/update-trip", validateUpdateTrips, asyncHandler(__TRIPS_CONTROLLER.updateTrip));
rootRouter.delete("/delete-trip/:trip_id", asyncHandler(__TRIPS_CONTROLLER.deleteTrip));
rootRouter.put("/update-ticket-price-advance", asyncHandler(__TRIPS_CONTROLLER.updateTicketPriceAdvance));
rootRouter.get("/count", asyncHandler(__TRIPS_CONTROLLER.countTrip));

module.exports = rootRouter;
