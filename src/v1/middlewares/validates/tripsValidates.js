const { query } = require("express-validator");

const validateTrips = [
   query("fromId").notEmpty().withMessage("From ID is required"),
   query("fromId").isInt().withMessage("From ID must be a number"),
   query("toId").notEmpty().withMessage("To ID is required"),
   query("toId").isInt().withMessage("To ID must be a number"),
   query("fromTime").notEmpty().withMessage("From time is required"),
   query("fromTime").isISO8601().withMessage("From time must be a valid date"),
   query("isReturn").notEmpty().withMessage("Is return is required"),
   query("isReturn").isBoolean().withMessage("Is return must be a boolean"),
   query("ticketCount").notEmpty().withMessage("Ticket count is required"),
   query("ticketCount").isInt().withMessage("Ticket count must be a number"),
];
const { body } = require("express-validator");

const validateCreateTrips = [
   body("route_id").notEmpty().withMessage("Route ID is required"),
   body("route_id").isInt().withMessage("Route ID must be a number"),
   body("vehicle_id").notEmpty().withMessage("Vehicle ID is required"),
   body("vehicle_id").isInt().withMessage("Vehicle ID must be a number"),
   body("trip_arrival_time").notEmpty().withMessage("Trip arrival time is required"),
   body("trip_departure_time").notEmpty().withMessage("Trip departure time is required"),
   body("trip_price").notEmpty().withMessage("Trip price is required"),
   body("trip_price").isFloat().withMessage("Trip price must be a number"),
   body("trip_discount").notEmpty().withMessage("Trip discount is required"),
   body("trip_discount").isFloat().withMessage("Trip discount must be a number"),
   body("trip_shuttle_enable").notEmpty().withMessage("Trip shuttle enable is required"),
   body("trip_shuttle_enable").isBoolean().withMessage("Trip shuttle enable must be a boolean"),
   body("allow_online_booking").notEmpty().withMessage("Allow online booking is required"),
   body("allow_online_booking").isBoolean().withMessage("Allow online booking must be a boolean"),
   body("trip_holiday").notEmpty().withMessage("Trip holiday is required"),
   body("trip_holiday").isBoolean().withMessage("Trip holiday must be a boolean"),
];

const validateUpdateTrips = [
   body("trip_id").notEmpty().withMessage("Trip ID is required"),
   body("trip_id").isInt().withMessage("Trip ID must be a number"),
   body("route_id").notEmpty().withMessage("Route ID is required"),
   body("route_id").isInt().withMessage("Route ID must be a number"),
   body("vehicle_id").notEmpty().withMessage("Vehicle ID is required"),
   body("vehicle_id").isInt().withMessage("Vehicle ID must be a number"),
   body("trip_arrival_time").notEmpty().withMessage("Trip arrival time is required"),
   body("trip_departure_time").notEmpty().withMessage("Trip departure time is required"),
   body("trip_price").notEmpty().withMessage("Trip price is required"),
   body("trip_price").isFloat().withMessage("Trip price must be a number"),
   body("trip_discount").notEmpty().withMessage("Trip discount is required"),
   body("trip_discount").isFloat().withMessage("Trip discount must be a number"),
   body("trip_shuttle_enable").notEmpty().withMessage("Trip shuttle enable is required"),
   body("trip_shuttle_enable").isBoolean().withMessage("Trip shuttle enable must be a boolean"),
   body("allow_online_booking").notEmpty().withMessage("Allow online booking is required"),
   body("allow_online_booking").isBoolean().withMessage("Allow online booking must be a boolean"),
   body("trip_holiday").notEmpty().withMessage("Trip holiday is required"),
   body("trip_holiday").isBoolean().withMessage("Trip holiday must be a boolean"),
];

module.exports = { validateCreateTrips, validateUpdateTrips, validateTrips };

