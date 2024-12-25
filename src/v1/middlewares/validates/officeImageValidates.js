const {body, query, param, header} = require("express-validator");

const validateCreateOfficeImage = [
   header("officeid").notEmpty().withMessage("Office ID is required"),
   header("officeid").isInt().withMessage("Office ID must be an integer"),
   header("officename").notEmpty().withMessage("Office Name is required"),
];

const validateUpdateOfficeImage = [
   header("officeid").notEmpty().withMessage("Office ID is required"),
   header("officeid").isInt().withMessage("Office ID must be an integer"),
   header("officename").notEmpty().withMessage("Office Name is required"),
];

const validateOfficeImageWithByIDToQuery = [
   query("officeImageId").notEmpty().withMessage("Office Image ID is required"),
];

module.exports = {
   validateCreateOfficeImage,
   validateUpdateOfficeImage,
   validateOfficeImageWithByIDToQuery,
};
