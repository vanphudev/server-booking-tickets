const express = require("express");
const rootRouter = express.Router();
const __ARTICLE_CONTROLLER = require("../../controllers/articleController");
const asyncHandler = require("../../middlewares/handleError");
const {validateArticleWithByIDToQuery} = require("../../middlewares/validates/articleValidates");

rootRouter
   .get("/getall", asyncHandler(__ARTICLE_CONTROLLER.getAllArticle))
   .get("/getbyid/:slug", validateArticleWithByIDToQuery, asyncHandler(__ARTICLE_CONTROLLER.getArticleById));

module.exports = rootRouter;
