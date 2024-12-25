const {param} = require("express-validator");

const validateProvinceById = [
   param("provinceId").notEmpty().withMessage("Province ID is required"),
   param("provinceId").isInt().withMessage("Province ID must be a number"),
];

module.exports = {validateProvinceById};
