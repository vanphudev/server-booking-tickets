const {param} = require("express-validator");

const validateDistrictById = [
   param("districtId").notEmpty().withMessage("District ID is required"),
   param("districtId").isInt().withMessage("District ID must be a number"),
];

module.exports = {validateDistrictById};
