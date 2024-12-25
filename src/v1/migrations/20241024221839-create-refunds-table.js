"use strict";

module.exports = {
   up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable(
         "refunds",
         {
            refund_id: {
               type: Sequelize.INTEGER,
               autoIncrement: true,
               primaryKey: true,
            },
            refund_code: {
               type: Sequelize.STRING(255),
               allowNull: false,
               unique: true,
            },
            ticket_id: {
               type: Sequelize.INTEGER,
               allowNull: false,
               references: {
                  model: {
                     tableName: "tickets",
                  },
                  key: "ticket_id",
               },
            },
            refund_amount: {
               type: Sequelize.DECIMAL(10, 2),
               defaultValue: 0.0,
               allowNull: false,
               validate: {
                  min: 0,
               },
            },
            refund_description: {
               type: Sequelize.STRING(500),
            },
            refund_percentage: {
               type: Sequelize.DECIMAL(10, 2),
               defaultValue: 0.0,
               allowNull: false,
               validate: {
                  min: 0,
                  max: 100,
               },
            },
            employee_id: {
               type: Sequelize.INTEGER,
               references: {
                  model: {
                     tableName: "employees",
                  },
                  key: "employee_id",
               },
            },
            office_id: {
               type: Sequelize.INTEGER,
               references: {
                  model: {
                     tableName: "offices",
                  },
                  key: "office_id",
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
            refunded_at: {
               type: Sequelize.DATE,
               allowNull: true,
            },
            is_refunded: {
               type: Sequelize.TINYINT,
               defaultValue: 0,
               validate: {
                  isIn: [[0, 1]],
               },
            },
            refund_method: {
               type: Sequelize.STRING(255),
               validate: {
                  isIn: [["online", "in_office"]],
               },
            },
            is_approved: {
               type: Sequelize.TINYINT,
               defaultValue: 0,
               validate: {
                  isIn: [[0, 1]],
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
      await queryInterface.dropTable("refunds");
   },
};
