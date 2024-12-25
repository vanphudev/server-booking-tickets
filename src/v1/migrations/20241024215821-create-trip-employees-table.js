"use strict";

module.exports = {
   up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable(
         "trip_employees",
         {
            trip_id: {
               type: Sequelize.INTEGER,
               allowNull: false,
               primaryKey: true,
               references: {
                  model: {
                     tableName: "trips",
                  },
                  key: "trip_id",
               },
            },
            employee_id: {
               type: Sequelize.INTEGER,
               allowNull: false,
               primaryKey: true,
               references: {
                  model: {
                     tableName: "employees",
                  },
                  key: "employee_id",
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
         },
         {
            charset: "utf8mb4",
            collate: "utf8mb4_unicode_ci",
         }
      );
   },

   down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable("trip_employees");
   },
};
