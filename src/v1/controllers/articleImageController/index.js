"use strict";

const __RESPONSE = require("../../core");
const {  getArticleImageById, createArticleImage, updateArticleImage, getArticleByArticleId, getAllArticleImages, deleteArticleImage, findAllDeleteActicleImages
} = require("../../services/articleImageService");
const __ARTICLE_IMAGE_CONTROLLER = {
   getArticleImageById: async (req, res, next) => {
      new __RESPONSE.OK({
         message: "Get article images successfully",
         metadata: await getArticleImageById(req, res),  
         request: req,
      }).send(res);
   },

   updateArticleImage: async (req, res, next) => {
      new __RESPONSE.UPDATE({
         message: "Article updated",
         metadata: await updateArticleImage(req),
         request: req,
      }).send(res);
   },
   getArticleByArticleId: async (req, res, next) => {
      try {
         const article = await getArticleByArticleId(req);
         req.article = article; 
         next();
      } catch (error) {
         next(error);
      }
   },
   
   createArticleImage: async (req, res, next) => {
      try {
         const result = await createArticleImage(req);
         new __RESPONSE.CREATED({
            message: "Create article image successfully",
            metadata: result,
            request: req,
         }).send(res);
      } catch (error) {
         next(error);
      }
   },
   getAllArticleImages: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "List of all article images",
         metadata: await getAllArticleImages(),
         request: req,
      }).send(res);
   },
   deleteArticleImage: async (req, res, next) => {
      new __RESPONSE.OK({
         message: "Xóa hình ảnh thành công",
         metadata: await deleteArticleImage(req),
         request: req,
      }).send(res);
   },
   findAllDeleteActicleImages: async (req, res, next) => {
      new __RESPONSE.OK({
         message: "Xóa hình ảnh thành công",
         metadata: await findAllDeleteActicleImages(req),
         request: req,
      }).send(res);
   },
};
module.exports = __ARTICLE_IMAGE_CONTROLLER;
