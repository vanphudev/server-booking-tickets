const {body, query, param} = require("express-validator");

const validateCreateArticleImage = [
   param("articleId")
      .trim()
      .notEmpty().withMessage("Article ID is required")
      .isInt().withMessage("Article ID must be an integer")
      .toInt(),
      
   body("images")
      .custom((value, {req}) => {
         if (!req.files || req.files.length === 0) {
            throw new Error("At least one image is required");
         }
         if (req.files.length > 5) {
            throw new Error("Maximum 5 images allowed");
         }
         // Kiểm tra định dạng file
         const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
         req.files.forEach(file => {
            if (!allowedTypes.includes(file.mimetype)) {
               throw new Error("Only JPG, JPEG and PNG files are allowed");
            }
            // Kiểm tra kích thước file (ví dụ: max 5MB)
            if (file.size > 5 * 1024 * 1024) {
               throw new Error("Each file must be less than 5MB");
            }
         });
         return true;
      })
];

const validateUpdateArticleImage = [
   query("articleImageId")  
      .trim()
      .notEmpty().withMessage("Article Image ID is required")
      .isInt().withMessage("Article Image ID must be an integer")
      .toInt(),
   
   body("image_article_name")
      .optional()
      .trim()
      .isString().withMessage("Image name must be a string")
      .isLength({ min: 3, max: 255 }).withMessage("Image name must be between 3 and 255 characters"),
   
   body("article_id")
      .optional()
      .isInt().withMessage("Article ID must be an integer")
      .toInt()
];
const validateArticleImageWithByIDToQuery = [
   query("articleImageId")
      .trim()
      .notEmpty().withMessage("Article Image ID is required")
      .isInt().withMessage("Article Image ID must be an integer")
      .toInt()
];

const validateDeleteArticleImage = [
   query("articleImageId")
      .trim()
      .notEmpty().withMessage("Article Image ID is required")
      .isInt().withMessage("Article Image ID must be an integer")
      .toInt()
];

const validateGetArticleImageById = [
   query("articleImageId")
      .trim()
      .notEmpty().withMessage("Article Image ID is required")
      .isInt().withMessage("Article Image ID must be an integer")
      .toInt()
];

const validateGetArticleImagesByArticleId = [
   query("articleId")
      .trim()
      .notEmpty().withMessage("Article ID is required")
      .isInt().withMessage("Article ID must be an integer")
      .toInt()
];
module.exports = {
   validateCreateArticleImage,
   validateUpdateArticleImage,
   validateArticleImageWithByIDToQuery,
   validateDeleteArticleImage,
   validateGetArticleImageById,        
   validateGetArticleImagesByArticleId  
};