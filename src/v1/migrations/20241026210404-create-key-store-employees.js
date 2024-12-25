"use strict";

module.exports = {
   up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable("key_store_employees", {
         key_store_employee_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
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
         private_key_employee: {
            type: Sequelize.TEXT("long"),
            allowNull: false,
         },
         public_key_employee: {
            type: Sequelize.TEXT("long"),
            allowNull: false,
         },
         refresh_token_key_employee: {
            type: Sequelize.TEXT("long"),
            allowNull: false,
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
      });
   },

   down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable("key_store_employees");
   },
};
