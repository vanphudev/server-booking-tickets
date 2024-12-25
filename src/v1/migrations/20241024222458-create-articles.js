"use strict";

module.exports = {
   up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable(
         "articles",
         {
            article_id: {
               type: Sequelize.INTEGER,
               autoIncrement: true,
               primaryKey: true,
            },
            article_title: {
               type: Sequelize.STRING(500),
               allowNull: false,
               unique: true,
            },
            article_description: {
               type: Sequelize.TEXT("long"),
            },
            article_content: {
               type: Sequelize.TEXT("long"),
               allowNull: false,
            },
            article_slug: {
               type: Sequelize.TEXT("long"),
               allowNull: false,
            },
            published_at: {
               type: Sequelize.DATE,
               defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            is_priority: {
               type: Sequelize.TINYINT,
               defaultValue: 0,
               validate: {
                  isIn: [[0, 1]],
               },
            },
            created_at: {
               type: Sequelize.DATE,
               defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            updated_at: {
               type: Sequelize.DATE,
               defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
               onUpdate: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            deleted_at: {
               type: Sequelize.DATE,
               defaultValue: null,
            },
            article_type_id: {
               type: Sequelize.INTEGER,
               allowNull: false,
               references: {
                  model: {
                     tableName: "article_types",
                  },
                  key: "article_type_id",
               },
            },
            employee_id: {
               type: Sequelize.INTEGER,
               allowNull: false,
               references: {
                  model: {
                     tableName: "employees",
                  },
                  key: "employee_id",
               },
            },
            thumbnail_img: {
               type: Sequelize.TEXT("long"),
               allowNull: true,
               validate: {
                  isBase64: true,
                  notEmpty: true,
               },
            },
         },
         {
            charset: "utf8mb4",
            collate: "utf8mb4_unicode_ci",
         }
      );
   },

   down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable("articles");
   },
};
