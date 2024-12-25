const { body, query, check, param } = require("express-validator");

const validateArticleWithByIDToQuery = [
   param("slug")
      .exists()
      .notEmpty()
      .withMessage("Article slug is required")
      .isString()
      .withMessage("Article slug must be a string"),
];
const validateCreateArticle = [
   body("article_title").notEmpty().withMessage("Article title cannot be empty"),
   body("article_content").notEmpty().withMessage("Article content cannot be empty"),
   body("is_priority").optional().isIn([0, 1]).withMessage("Priority must be 0 or 1"),
   body("article_type_id").optional().isInt().withMessage("Article type ID must be a number"),
   body("employee_id").optional().isInt().withMessage("Employee ID must be a number"),
   body("thumbnail_img").optional(),
];

const validateUpdateArticle = [
   body("article_id").notEmpty().withMessage("Article ID cannot be empty"),
   ...validateCreateArticle,
];

module.exports = {
   validateUpdateArticle,
   validateCreateArticle,
   validateArticleWithByIDToQuery,
};
