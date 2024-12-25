const { body } = require("express-validator");

const validateCreateRoute = [
   body("route_name").notEmpty().withMessage("Route name is required"),
   body("route_duration").notEmpty().withMessage("Route duration is required"),
   body("route_distance").notEmpty().withMessage("Route distance is required"),
   body("route_price").notEmpty().withMessage("Route price is required"),
   body("way_id").notEmpty().withMessage("Way id is required"),
];

const validateUpdateRoute = [
   body("route_id").notEmpty().withMessage("Route id is required"),
   body("route_name").notEmpty().withMessage("Route name is required"),
   body("route_duration").notEmpty().withMessage("Route duration is required"),
   body("route_distance").notEmpty().withMessage("Route distance is required"),
   body("route_price").notEmpty().withMessage("Route price is required"),
   body("way_id").notEmpty().withMessage("Way id is required"),
];

module.exports = {
   validateCreateRoute,
   validateUpdateRoute,
};
