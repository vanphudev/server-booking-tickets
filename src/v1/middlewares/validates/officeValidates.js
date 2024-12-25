const {body, query, param} = require("express-validator");

const validateOfficeWithByIDToQuery = [
   query("officeId").notEmpty().withMessage("Name is required"),
   query("officeId").isInt().withMessage("Office ID must be a number"),
];

const validateOfficeWithByIDToParams = [
   param("officeId").notEmpty().withMessage("Name is required"),
   param("officeId").isInt().withMessage("Office ID must be a number"),
];

const validateCreateOffice = [
   body("name").notEmpty().withMessage("Name is required"),
   body("address").notEmpty().withMessage("Address is required"),
   body("phone").notEmpty().withMessage("Phone is required"),
   body("fax").notEmpty().withMessage("Fax is required"),
   body("description").notEmpty().withMessage("Description is required"),
   body("latitude").notEmpty().withMessage("Latitude is required"),
   body("longitude").notEmpty().withMessage("Longitude is required"),
   body("map_url").notEmpty().withMessage("Map URL is required"),
   body("wardId").notEmpty().withMessage("Map URL is required"),
   body("map_url").isURL().withMessage("Map URL must be a valid URI"),
   body("phone").isMobilePhone("vi-VN").withMessage("Phone must be a valid phone number"),
   body("fax").isMobilePhone("vi-VN").withMessage("Fax must be a valid phone number"),
];

const validateUpdateOffice = [
   body("officeId").notEmpty().withMessage("Office ID is required"),
   body("name").notEmpty().withMessage("Name is required"),
   body("address").notEmpty().withMessage("Address is required"),
   body("phone").notEmpty().withMessage("Phone is required"),
   body("fax").notEmpty().withMessage("Fax is required"),
   body("description").notEmpty().withMessage("Description is required"),
   body("latitude").notEmpty().withMessage("Latitude is required"),
   body("longitude").notEmpty().withMessage("Longitude is required"),
   body("map_url").notEmpty().withMessage("Map URL is required"),
   body("map_url").isURL().withMessage("Map URL must be a valid URI"),
   body("phone").isMobilePhone("vi-VN").withMessage("Phone must be a valid phone number"),
   body("fax").isMobilePhone("vi-VN").withMessage("Fax must be a valid phone number"),
];

module.exports = {
   validateCreateOffice,
   validateUpdateOffice,
   validateOfficeWithByIDToQuery,
   validateOfficeWithByIDToParams,
};
