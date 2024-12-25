"use strict";

const {uniqueId} = require("lodash");

module.exports = {
   up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable(
         "drivers",
         {
            driver_id: {
               type: Sequelize.INTEGER,
               autoIncrement: true,
               primaryKey: true,
            },
            driver_license_number: {
               type: Sequelize.STRING(500),
               allowNull: false,
            },
            driver_experience_years: {
               type: Sequelize.INTEGER,
               allowNull: true,
               validate: {
                  min: 0,
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
            employee_id: {
               type: Sequelize.INTEGER,
               allowNull: false,
               unique: true,
               references: {
                  model: {
                     tableName: "employees",
                  },
                  key: "employee_id",
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
      await queryInterface.dropTable("drivers");
   },
};
