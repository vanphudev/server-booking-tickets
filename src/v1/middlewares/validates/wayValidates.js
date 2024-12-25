const {body, query} = require("express-validator");

const validateWayWithByIDToQuery = [
   query("wayId").notEmpty().withMessage("Name is required"),
   query("wayId").isInt().withMessage("Way ID must be a number"),
];

const validateCreateWay = [
   body("name").notEmpty().withMessage("Name is required"),
   body("description").notEmpty().withMessage("Description is required"),
];

const validateUpdateWay = [
   body("wayId").notEmpty().withMessage("Way ID is required"),
   body("name").notEmpty().withMessage("Name is required"),
   body("description").notEmpty().withMessage("Description is required"),
];

module.exports = {
   validateCreateWay,
   validateUpdateWay,
   validateWayWithByIDToQuery,
};
