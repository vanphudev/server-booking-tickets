"use strict";

module.exports = {
   up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable(
         "vouchers",
         {
            voucher_id: {
               type: Sequelize.INTEGER,
               autoIncrement: true,
               primaryKey: true,
            },
            voucher_code: {
               type: Sequelize.STRING(255),
               allowNull: false,
               unique: true,
            },
            voucher_discount_percentage: {
               type: Sequelize.DECIMAL(10, 2),
               defaultValue: 0.0,
               validate: {
                  min: 0,
               },
            },
            voucher_discount_max_amount: {
               type: Sequelize.DECIMAL(10, 2),
               defaultValue: 0.0,
               validate: {
                  min: 0,
               },
            },
            voucher_usage_limit: {
               type: Sequelize.INTEGER,
               defaultValue: 1,
               validate: {
                  min: 1,
               },
            },
            voucher_valid_from: {
               type: Sequelize.DATE,
               defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            voucher_valid_to: {
               type: Sequelize.DATE,
               defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            voucher_created_by: {
               type: Sequelize.INTEGER,
               allowNull: true,
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
      await queryInterface.dropTable("vouchers");
   },
};
