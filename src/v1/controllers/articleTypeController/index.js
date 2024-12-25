"use strict";

const __RESPONSE = require("../../core");
const {getAllArticleTypes, getArticleTypeById, createArticleType, updateArticleType, deleteArticleType, findAllDeletedArticleType} = require("../../services/typeArticleService");

const __TYPE_ARTICLE_CONTROLLER = {
   getAllArticleTypes: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "List of all article types",
         metadata: await getAllArticleTypes(),
         request: req,
      }).send(res);
   },
   getArticleTypeById: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "article type details",
         metadata: await getArticleTypeById(req),
         request: req,
      }).send(res);
   },
   createArticleType: async (req, res, next) => {
      new __RESPONSE.CREATED({
         message: "article type created",
         metadata: await createArticleType(req),
         request: req,
      }).send(res);
   },
   updateArticleType: async (req, res, next) => {
      new __RESPONSE.UPDATE({
         message: "article updated",
         metadata: await updateArticleType(req),
         request: req,
      }).send(res);
   },
   deleteArticleType: async (req, res, next) => {
      new __RESPONSE.DELETE({
         message: "Article typedeleted",
         metadata: await deleteArticleType(req),
         request: req,
      }).send(res);
   },
   findAllDeletedArticleType: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "List of all deleted article types",
         metadata: await findAllDeletedArticleType(req),
         request: req,
      }).send(res);
   },
};


module.exports = __TYPE_ARTICLE_CONTROLLER;
