const express = require("express");
const rootRouter = express.Router();
const __RESPONSE = require("../../core/errorResponse");
const __TYPE_ARTICLE_CONTROLLER = require("../../controllers/articleTypeController");
const asyncHandler = require("../../middlewares/handleError");
const {
   validateUpdateArticleType,
   validateCreateArticleType,
   validateArticleTypeWithByIDToQuery,
} = require("../../middlewares/validates/articleTypeValidates");

rootRouter
   .get("/getall", asyncHandler(__TYPE_ARTICLE_CONTROLLER.getAllArticleTypes))
   .get("/getalldeleted", asyncHandler(__TYPE_ARTICLE_CONTROLLER.findAllDeletedArticleType))
   .put("/update", validateUpdateArticleType, asyncHandler(__TYPE_ARTICLE_CONTROLLER.updateArticleType))
   .get("/getbyid", validateArticleTypeWithByIDToQuery, asyncHandler(__TYPE_ARTICLE_CONTROLLER.getArticleTypeById))
  .post("/create", validateCreateArticleType, asyncHandler(__TYPE_ARTICLE_CONTROLLER.createArticleType))
   .delete("/delete", validateArticleTypeWithByIDToQuery, asyncHandler(__TYPE_ARTICLE_CONTROLLER.deleteArticleType));

module.exports = rootRouter;
