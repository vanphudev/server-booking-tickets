"use strict";

const __RESPONSE = require("../../core");
const {
   getAllArticle,
   getArticleById,
   createArticle,
   updateArticle,
   deleteArticle,
   getAllArticleAdmin,
   getArticleType,
} = require("../../services/articleService");

const __ARTICLE_CONTROLLER = {
   getAllArticle: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "List of all article",
         metadata: await getAllArticle(),
         request: req,
      }).send(res);
   },

   getArticleById: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "article details",
         metadata: await getArticleById(req),
         request: req,
      }).send(res);
   },

   createArticle: async (req, res, next) => {
      new __RESPONSE.CREATED({
         message: "Article created",
         metadata: await createArticle(req),
         request: req,
      }).send(res);
   },
   updateArticle: async (req, res, next) => {
      new __RESPONSE.UPDATE({
         message: "Article updated",
         metadata: await updateArticle(req),
         request: req,
      }).send(res);
   },
   deleteArticle: async (req, res, next) => {
      new __RESPONSE.DELETE({
         message: "Article deleted",
         metadata: await deleteArticle(req),
         request: req,
      }).send(res);
   },
   getAllArticleAdmin: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "List of all article",
         metadata: await getAllArticleAdmin(req),
         request: req,
      }).send(res);
   },
   getArticleType: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "List of all article type",
         metadata: await getArticleType(req),
         request: req,
      }).send(res);
   },
};

module.exports = __ARTICLE_CONTROLLER;
