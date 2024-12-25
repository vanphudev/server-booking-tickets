const express = require("express");
const rootRouter = express.Router();
const __ARTICLE_CONTROLLER = require("../../controllers/articleController");
const asyncHandler = require("../../middlewares/handleError");
const {
   validateUpdateArticle,
   validateCreateArticle,
} = require("../../middlewares/validates/articleValidates");

rootRouter
   .post("/create", validateCreateArticle, asyncHandler(__ARTICLE_CONTROLLER.createArticle))
   .put("/update", validateUpdateArticle, asyncHandler(__ARTICLE_CONTROLLER.updateArticle))
   .delete("/delete/:article_id", asyncHandler(__ARTICLE_CONTROLLER.deleteArticle))
   .get("/getalladmin", asyncHandler(__ARTICLE_CONTROLLER.getAllArticleAdmin))
   .get("/getArticleType", asyncHandler(__ARTICLE_CONTROLLER.getArticleType));

module.exports = rootRouter;
