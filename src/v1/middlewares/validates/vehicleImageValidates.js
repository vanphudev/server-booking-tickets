const {body, query, param} = require("express-validator");
const validateCreateVehicleImage = [
   param("vehicleId").notEmpty().withMessage("Vehicle ID is required"),
   param("vehicleId").isInt().withMessage("Vehicle ID must be an integer"),
];

const validateUpdateVehicleImage = [
   query("vehicleImageId")
      .notEmpty().withMessage("Vehicle Image ID is required")
      .isInt().withMessage("Vehicle Image ID must be an integer"),
   body("vehicle_image_description")
      .optional()
      .isString().withMessage("Description must be a string")
      .trim()
      .isLength({ min: 3, max: 255 }).withMessage("Description length must be between 3 and 255 characters"),
   body("vehicle_id")
      .optional()
      .isInt().withMessage("Vehicle ID must be an integer")
];

const validateVehicleImageWithByIDToQuery = [
   query("vehicleImageId").notEmpty().withMessage("vehicle Image ID is required"),
];

module.exports = {
   validateCreateVehicleImage,
   validateUpdateVehicleImage,
   validateVehicleImageWithByIDToQuery,
};
