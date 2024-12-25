const {body, query} = require("express-validator");

const validateVehicleTypeWithByIDToQuery = [
   query("vehicleTypeId")
      .notEmpty().withMessage("Vehicle type ID is required")
      .isInt().withMessage("Vehicle type ID must be a number"),
];

const validateCreateVehicleType = [

   body("name")
      .notEmpty().withMessage("Vehicle type name is required")
      .isString().withMessage("Name must be string"),
   body("description")
      .optional() 
      .isString().withMessage("Description must be string"),
];

const validateUpdateVehicleType = [
   // Sửa từ "typeid" thành "vehicleTypeId"
   body("vehicleTypeId")
      .notEmpty().withMessage("Vehicle type ID is required")
      .isInt().withMessage("Vehicle type ID must be a number"),
 
   body("name")
      .notEmpty().withMessage("Vehicle type name is required")
      .isString().withMessage("Name must be string"),

   body("description")
      .optional() 
      .isString().withMessage("Description must be string"),
];

module.exports = {
   validateVehicleTypeWithByIDToQuery,
   validateCreateVehicleType,
   validateUpdateVehicleType,
};