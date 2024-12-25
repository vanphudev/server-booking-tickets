"use strict";
module.exports = {
   up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable(
         "provinces",
         {
            province_id: {
               type: Sequelize.STRING(50),
               primaryKey: true,
            },
            province_name: {
               type: Sequelize.STRING(255),
            },
            province_grade: {
               type: Sequelize.STRING(255),
            },
            province_description: {
               type: Sequelize.STRING(500),
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
         },
         {
            charset: "utf8mb4",
            collate: "utf8mb4_unicode_ci",
         }
      );
   },
   down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable("provinces");
   },
};
