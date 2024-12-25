"use strict";
const __RESPONSE = require("../../core");
const {validationResult} = require("express-validator");
const db = require("../../models");
const {handleUpload, deleteImage} = require("../../utils/uploadImages");
const {normalizeVietnameseString} = require("../../utils/normalizeVietnameseString");
const __VEHICLE_IMAGE_FOLDER = "vehicle_images";

const getAllArticleTypes = async (req) => {
   try {
      const articleTypes = await db.ArticleType.findAll({
         attributes: [
            "article_type_id",
            "article_title", 
            "article_field",
            "is_highlight",
         ],
         include: [
            {
               model: db.Article,
               as: "articleType_to_article",
               attributes: [
                  "article_id",
                  "article_title",
                  "article_description",
                  "article_content",
                  "article_slug",
                  "published_at",
                  "is_priority",
                  "article_type_id",
                  "employee_id",
                  "thumbnail_img",
                  "thumbnail_img_public_id",
               ]
            }
         ],
         nest: true,
         raw: true
      });

      if (!articleTypes?.length) {
         throw new __RESPONSE.NotFoundError({
            message: "Không tìm thấy loại phương tiện nào",
            suggestion: "Vui lòng kiểm tra lại yêu cầu",
            request: req
         });
      }

      return {
         articleTypes,
         total: articleTypes.length
      };

   } catch (error) {
      if (error instanceof __RESPONSE.NotFoundError) {
         throw error;
      }
      
      throw new __RESPONSE.BadRequestError({
         message: `Lỗi khi lấy danh sách loại phương tiện: ${error.message}`,
         suggestion: "Vui lòng kiểm tra lại yêu cầu",
         request: req
      });
   }
};

const getArticleTypeById = async (req) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      throw new __RESPONSE.BadRequestError({
         message: "Validation failed " + errors.array()[0]?.msg + " !",
         suggestion: "Please provide the correct data",
         request: req,
      });
   }
   const {articleTypeId} = req.query;
   return await db.ArticleType.findOne({
      where: {
         article_type_id: articleTypeId,
      },
      attributes: [
         "article_type_id",
         "article_title", 
         "article_field",
         "is_highlight",
      ],
      include: [
         {
            model: db.Article,
            as: "articleType_to_article",
            attributes: [
               "article_id",
               "article_title",
               "article_description",
               "article_content",
               "article_slug",
               "published_at",
               "is_priority",
               "article_type_id",
               "employee_id",
               "thumbnail_img",
               "thumbnail_img_public_id",
            ]
         }
      ],
      nest: true,
      raw: true,
   })
      .then((articleType) => {
         if (!articleType) {
            throw new __RESPONSE.NotFoundError({
               message: "Resource not found - article Type not found !",
               suggestion: "Please check your request",
               request: req,
            });
         }
         return {articleType};
      })
      .catch((error) => {
         if (error instanceof __RESPONSE.NotFoundError) {
            throw error;
         }
         throw new __RESPONSE.BadRequestError({
            message: "Error in getting office by id " + error.message,
            suggestion: "Please check your request",
            request: req,
         });
      });
};
const createArticleType = async (req) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      throw new __RESPONSE.BadRequestError({
         message: "Validation failed " + errors.array()[0]?.msg + " !",
         suggestion: "Please provide the correct data",
         request: req,
      });
   }
   const { title, field, highlight} = req.body;
   return await db.ArticleType.create({
      article_title: title,
      article_field: field,
      is_highlight: highlight,
   
   })
      .then((articleType) => {
         if (!articleType) {
            throw new __RESPONSE.BadRequestError({
               message: "Error in creating article Type",
               suggestion: "Please check your request",
               request: req,
            });
         }
         return {articleType};
      })
      .catch((error) => {
         if (error.original?.code === "ER_DUP_ENTRY") {
            throw new __RESPONSE.BadRequestError({
               message: "article Type already exists " + error.original.sqlMessage,
               suggestion: "Please check your request",
               request: req,
            });
         }
         throw new __RESPONSE.BadRequestError({
            message: "Error in creating article Type ",
            suggestion: "Please check your request",
            request: req,
         });
      });
};

const updateArticleType = async (req) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      throw new __RESPONSE.BadRequestError({
         message: "Validation failed " + errors.array()[0]?.msg + " !",
         suggestion: "Please provide the correct data",
         request: req,
      });
   }
   const {articleTypeId,  title, field, highlight} = req.body;
   const articleType = await db.ArticleType.findOne({
      where: {
         article_type_id: articleTypeId,
      },
      attributes: [
         "article_type_id",
         "article_title", 
         "article_field",
         "is_highlight",
      ],
      include: [
         {
            model: db.Article,
            as: "articleType_to_article",
            attributes: [
               "article_id",
               "article_title",
               "article_description",
               "article_content",
               "article_slug",
               "published_at",
               "is_priority",
               "article_type_id",
               "employee_id",
               "thumbnail_img",
               "thumbnail_img_public_id",
            ]
         }
      ],
   });
   if (!articleType) {
      throw new __RESPONSE.NotFoundError({
         message: "Resource not found - article Type not found !",
         suggestion: "Please check your request",
         request: req,
      });
   }
   return await articleType
      .update({
         article_title: title,
         article_field: field,
         is_highlight: highlight,
      })
      .then((articleType) => {
         if (!articleType) {
            throw new __RESPONSE.BadRequestError({
               message: "Error in updating vehicle Type",
               suggestion: "Please check your request",
               request: req,
            });
         }
         return {articleType};
      })
      .catch((error) => {
         if (error.original?.code === "ER_DUP_ENTRY") {
            throw new __RESPONSE.BadRequestError({
               message: "article Type already exists " + error.original.sqlMessage,
               suggestion: "Please check your request",
               request: req,
            });
         }
         throw new __RESPONSE.BadRequestError({
            message: "Error in updating article type",
            suggestion: "Please check your request",
            request: req,
         });
      });
};

const deleteArticleType = async (req) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      throw new __RESPONSE.BadRequestError({
         message: "Validation failed " + errors.array()[0]?.msg + " !",
         suggestion: "Please provide the correct data",
         request: req,
      });
   }
   const {articleTypeId} = req.query;
   const articleType = await db.ArticleType.findOne({
      where: {
         article_type_id: articleTypeId,
      },
   });
   if (!articleType) {
      throw new __RESPONSE.NotFoundError({
         message: "Resource not found - vehicle type not found !",
         suggestion: "Please check your request",
         request: req,
      });
   }
   return await articleType
      .destroy()
      .then((articleType) => {
         if (!articleType) {
            throw new __RESPONSE.NotFoundError({
               message: "Resource not found - Vehicle type not found !",
               suggestion: "Please check your request",
               request: req,
            });
         }
         return {articleType};
      })
      .catch((error) => {
         if (error.original && error.original.code === "ER_ROW_IS_REFERENCED_2") {
            throw new __RESPONSE.BadRequestError({
               message: "article type is referenced by other tables",
               suggestion: "Please check your request",
               request: req,
            });
         }
         throw new __RESPONSE.BadRequestError({
            message: "Error in deleting article type",
            suggestion: "Please check your request",
            request: req,
         });
      });
};

const findAllDeletedArticleType = async (req) => {
   // Sửa từ db.vehicleType thành db.VehicleType
   return await db.ArticleType.findAll({
      attributes: [
         "article_type_id",
         "article_title", 
         "article_field",
         "is_highlight",
      ],
      where: {
         deleted_at: {[db.Sequelize.Op.ne]: null},
      },
      order: [["deleted_at", "DESC"]],
      include: [
         {
            model: db.Article,
            as: "articleType_to_article",
            attributes: [
               "article_id",
               "article_title",
               "article_description",
               "article_content",
               "article_slug",
               "published_at",
               "is_priority",
               "article_type_id",
               "employee_id",
               "thumbnail_img",
               "thumbnail_img_public_id",
            ]
         }
      ],
      paranoid: false,
      nest: true,
      raw: true,
   })
      .then((articleType) => {
         if (!articleType?.length) {  
            throw new __RESPONSE.NotFoundError({
               message: "Resource not found - List of all deleted article type not found !",
               suggestion: "Please check your request",
               request: req,
            });
         }
         return {articleType, total: articleType.length};
      })
      .catch((error) => {
         // Thêm error message gốc vào thông báo lỗi
         throw new __RESPONSE.BadRequestError({
            message: `Error in finding all deleted type article Type: ${error.message}`,
            suggestion: "Please check your request",
            request: req,
         });
      });
};
module.exports = {
   getAllArticleTypes,
   getArticleTypeById,
   createArticleType,
   updateArticleType,
   deleteArticleType,
   findAllDeletedArticleType,
};

