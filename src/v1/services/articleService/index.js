"use strict";
const __RESPONSE = require("../../core");
const {validationResult} = require("express-validator");
const db = require("../../models");

const getAllArticle = async (req) => {
   return await db.Article.findAll({
      where: {
         article_type_id: 1,
      },
   })
      .then((articles) => {
         if (!articles || articles.length === 0) {
            throw new __RESPONSE.NotFoundError({
               message: "No articles found",
               suggestion: "Please check if there are any articles in the database",
               request: req,
            });
         }
         return {
            articles,
            total: articles.length,
         };
      })
      .catch((error) => {
         throw new __RESPONSE.BadRequestError({
            message: `Error in getting all articles: ${error.message}`,
            suggestion: "Please check database connection and Article model",
            request: req,
         });
      });
};

const getArticleById = async (req) => {
   const {slug} = req.params;
   return await db.Article.findOne({
      where: {
         article_slug: slug,
      },
   })
      .then((article) => {
         if (!article) {
            throw new __RESPONSE.NotFoundError({
               message: "No articles found",
               suggestion: "Please check if there are any articles in the database",
               request: req,
            });
         }
         return {
            article,
         };
      })
      .catch((error) => {
         throw new __RESPONSE.BadRequestError({
            message: `Error in getting all articles: ${error.message}`,
            suggestion: "Please check database connection and Article model",
            request: req,
         });
      });
};

const formatSlug = (title) => {
   // Xóa dấu tiếng Việt
   let slug = title
      .toLowerCase()
      .replace(/[áàảãạâấầẩẫậăắằẳẵặ]/g, "a")
      .replace(/[éèẻẽẹêếềểễệ]/g, "e")
      .replace(/[íìỉĩị]/g, "i")
      .replace(/[óòỏõọôốồổỗộơớờởỡợ]/g, "o")
      .replace(/[úùủũụưứừửữự]/g, "u")
      .replace(/[ýỳỷỹỵ]/g, "y")
      .replace(/đ/g, "d");

   // Xóa ký tự đặc biệt
   slug = slug.replace(/[^a-z0-9\s-]/g, "");

   // Thay khoảng trắng bằng dấu gạch ngang
   slug = slug.replace(/\s+/g, "-");

   // Xóa các dấu gạch ngang liên tiếp
   slug = slug.replace(/-+/g, "-");

   // Xóa gạch ngang ở đầu và cuối
   slug = slug.replace(/^-+|-+$/g, "");

   return slug;
};

const createArticle = async (req) => {
   try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         throw new __RESPONSE.BadRequestError({
            message: "Validation failed " + errors.array()[0]?.msg + " !",
            suggestion: "Please provide the correct data",
            request: req,
         });
      }

      const {article_title, article_content, is_priority, article_type_id, employee_id, published_at, thumbnail_img} =
         req.body;

      const article_slug = formatSlug(article_title);

      const article = await db.Article.create({
         article_title,
         article_description: null,
         article_content,
         article_slug,
         published_at: published_at || new Date(),
         is_priority: is_priority || 0,
         article_type_id,
         employee_id,
         thumbnail_img,
      });

      if (!article) {
         throw new __RESPONSE.BadRequestError({
            message: "Error in creating article",
            suggestion: "Please check your request",
            request: req,
         });
      }

      return {article};
   } catch (error) {
      if (error.original?.code === "ER_DUP_ENTRY") {
         throw new __RESPONSE.BadRequestError({
            message: "Đã tồn tại bài viết với slug: " + error.original.sqlMessage,
            suggestion: "Article title or slug might be duplicate. Please check and try again",
            request: req,
         });
      }
      throw new __RESPONSE.BadRequestError({
         message: "Error in creating article: " + error.message,
         suggestion: "Please check your request data",
         request: req,
      });
   }
};

const updateArticle = async (req) => {
   try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         throw new __RESPONSE.BadRequestError({
            message: "Validation failed " + errors.array()[0]?.msg + " !",
            suggestion: "Please provide the correct data",
            request: req,
         });
      }
      const {article_id, article_title, article_content, is_priority, article_type_id, employee_id, thumbnail_img} =
         req.body;

      const existingArticle = await db.Article.findByPk(article_id);
      if (!existingArticle) {
         throw new __RESPONSE.NotFoundError({
            message: "Article not found",
            suggestion: "Please check article ID",
            request: req,
         });
      }

      return await db.Article.update(
         {
            article_title,
            article_content,
            is_priority,
            article_type_id,
            employee_id,
            thumbnail_img,
         },
         {
            where: {article_id},
         }
      ).then((updatedRows) => {
         if (updatedRows === 0) {
            throw new __RESPONSE.BadRequestError({
               message: "Error updating article",
               suggestion: "Please check your request data",
               request: req,
            });
         }
         return {article: updatedRows};
      });
   } catch (error) {
      if (error.original?.code === "ER_DUP_ENTRY") {
         const duplicateField = error.original.sqlMessage.includes("article_title")
            ? "tiêu đề bài viết"
            : error.original.sqlMessage.includes("article_slug")
            ? "đường dẫn bài viết"
            : "dữ liệu";

         throw new __RESPONSE.BadRequestError({
            message: `Đã tồn tại ${duplicateField} này trong hệ thống`,
            suggestion: `Vui lòng kiểm tra lại ${duplicateField} và thử lại`,
            request: req,
         });
      }
      throw new __RESPONSE.BadRequestError({
         message: "Error in updating article: " + error.message,
         suggestion: "Please check your request data",
         request: req,
      });
   }
};

const deleteArticle = async (req) => {
   const {article_id} = req.params;
   if (!article_id) {
      throw new __RESPONSE.BadRequestError({
         message: "Please provide article ID",
         suggestion: "Please check your request",
         request: req,
      });
   }

   const article = await db.Article.findOne({
      where: {
         article_id: article_id,
      },
   });

   if (!article) {
      throw new __RESPONSE.NotFoundError({
         message: "Resource not found - Article not found !",
         suggestion: "Please check your request",
         request: req,
      });
   }

   return await article
      .destroy()
      .then((article) => {
         if (!article) {
            throw new __RESPONSE.NotFoundError({
               message: "Resource not found - Article not found !",
               suggestion: "Please check your request",
               request: req,
            });
         }
         return {article};
      })
      .catch((error) => {
         if (error.original && error.original.code === "ER_ROW_IS_REFERENCED_2") {
            throw new __RESPONSE.BadRequestError({
               message: "Article is referenced by other tables (ImageArticle, ArticleTag)",
               suggestion: "Please remove related records first",
               request: req,
            });
         }
         throw new __RESPONSE.BadRequestError({
            message: "Error in deleting article",
            suggestion: "Please check your request",
            request: req,
         });
      });
};

const getAllArticleAdmin = async (req) => {
   return await db.Article.findAll({
      include: [
         {
            model: db.ArticleType,
            as: "article_belongto_articleType",
         },
         {
            model: db.Employee,
            as: "article_belongto_employee",
            attributes: ["employee_id", "employee_full_name", "employee_email"],
         },
      ],
   })
      .then((articles) => {
         if (!articles || articles.length === 0) {
            throw new __RESPONSE.NotFoundError({
               message: "No articles found",
               suggestion: "Please check if there are any articles in the database",
               request: req,
            });
         }
         return {
            articles,
            total: articles.length,
         };
      })
      .catch((error) => {
         throw new __RESPONSE.BadRequestError({
            message: `Error in getting all articles: ${error.message}`,
            suggestion: "Please check database connection and Article model",
            request: req,
         });
      });
};

const getArticleType = async (req) => {
   return await db.ArticleType.findAll()
      .then((articleTypes) => {
         if (!articleTypes || articleTypes.length === 0) {
            throw new __RESPONSE.NotFoundError({
               message: "No article types found",
               suggestion: "Please check if there are any article types in the database",
               request: req,
            });
         }
         return {articleTypes};
      })
      .catch((error) => {
         throw new __RESPONSE.BadRequestError({
            message: `Error in getting all article types: ${error.message}`,
            suggestion: "Please check database connection and ArticleType model",
            request: req,
         });
      });
};

module.exports = {
   getAllArticle,
   getArticleById,
   createArticle,
   updateArticle,
   deleteArticle,
   getAllArticleAdmin,
   getArticleType,
};
