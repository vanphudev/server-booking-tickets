const { body } = require("express-validator");

const validateCreateVehicle = [
   body("vehicle_license_plate").notEmpty().withMessage("license plate is required"),
   body("vehicle_model").notEmpty().withMessage("Model is required"),
   body("vehicle_brand").notEmpty().withMessage("brand is required"),
   body("vehicle_capacity").notEmpty().withMessage("Capacity is required"),
   body("vehicle_manufacture_year").notEmpty().withMessage("manufacture year is required"),
   body("map_vehicle_layout_id").notEmpty().withMessage("map vehicle layout id is required"),
   body("office_id").notEmpty().withMessage("office id is required"),
];

const validateUpdateVehicle = [
   body("vehicle_id").notEmpty().withMessage("Vehicle ID is required"),
   body("vehicle_license_plate").notEmpty().withMessage("license plate is required"),
   body("vehicle_model").notEmpty().withMessage("Model is required"),
   body("vehicle_brand").notEmpty().withMessage("brand is required"),
   body("vehicle_capacity").notEmpty().withMessage("Capacity is required"),
   body("vehicle_manufacture_year").notEmpty().withMessage("manufacture year is required"),
   body("map_vehicle_layout_id").notEmpty().withMessage("map vehicle layout id is required"),
   body("office_id").notEmpty().withMessage("office id is required"),
];

module.exports = {
   validateCreateVehicle,
   validateUpdateVehicle,
};
