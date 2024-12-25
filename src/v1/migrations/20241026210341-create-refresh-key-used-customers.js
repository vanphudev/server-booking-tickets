"use strict";

module.exports = {
   up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable("refresh_key_used_customers", {
         refreshkey_used_customer_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
         },
         key_store_customer_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
               model: {
                  tableName: "key_store_customers",
               },
               key: "key_store_customer_id",
            },
            onDelete: "CASCADE",
         },
         refreshkey_used_customer_key: {
            type: Sequelize.TEXT("long"),
            allowNull: false,
         },
         used_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
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
      await queryInterface.dropTable("refresh_key_used_customers");
   },
};
