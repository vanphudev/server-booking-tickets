"use strict";
module.exports = {
   up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable(
         "districts",
         {
            district_id: {
               type: Sequelize.STRING(50),
               allowNull: false,
               primaryKey: true,
            },
            district_name: {
               type: Sequelize.STRING(255),
            },
            district_description: {
               type: Sequelize.STRING(500),
            },
            district_grade: {
               type: Sequelize.STRING(255),
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
            province_id: {
               type: Sequelize.STRING(50),
               references: {
                  model: {
                     tableName: "provinces",
                  },
                  key: "province_id",
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
      await queryInterface.dropTable("districts");
   },
};
