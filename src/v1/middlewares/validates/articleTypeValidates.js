const {body, query} = require("express-validator");

const validateArticleTypeWithByIDToQuery = [
   query("articleTypeId")
      .notEmpty().withMessage("Vehicle type ID is required")
      .isInt().withMessage("Vehicle type ID must be a number"),
];

const validateCreateArticleType = [

    body("title")
      .notEmpty().withMessage("Article type title is required") 
      .isString().withMessage("Title must be string"),
   body("field")
      .notEmpty().withMessage("Article field is required") 
      .isString().withMessage("Field must be string"), 
   body("highlight")
      .optional()
      .isBoolean().withMessage("Highlight must be boolean"),
];

const validateUpdateArticleType = [
   body("articleTypeId")
      .notEmpty().withMessage("Vehicle type ID is required")
      .isInt().withMessage("Vehicle type ID must be a number"),
      body("title")
      .notEmpty().withMessage("Article type title is required") 
      .isString().withMessage("Title must be string"),
   body("field")
      .notEmpty().withMessage("Article field is required") 
      .isString().withMessage("Field must be string"), 
   body("highlight")
      .optional()
      .isBoolean().withMessage("Highlight must be boolean"),
];

module.exports = {
validateUpdateArticleType,
validateCreateArticleType,
validateArticleTypeWithByIDToQuery,
};