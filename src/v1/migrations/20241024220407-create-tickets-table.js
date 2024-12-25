"use strict";

module.exports = {
   up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable(
         "tickets",
         {
            ticket_id: {
               type: Sequelize.INTEGER,
               autoIncrement: true,
               primaryKey: true,
            },
            ticket_code: {
               type: Sequelize.STRING(255),
               allowNull: false,
               unique: true,
            },
            booking_seat_id: {
               type: Sequelize.INTEGER,
               references: {
                  model: {
                     tableName: "booking_seats",
                  },
                  key: "booking_seat_id",
               },
            },
            ticket_name_chair: {
               type: Sequelize.STRING(255),
               allowNull: false,
            },
            is_export_ticket: {
               type: Sequelize.TINYINT,
               defaultValue: 0,
               validate: {
                  isIn: [[0, 1]],
               },
            },
            ticket_amount: {
               type: Sequelize.DECIMAL(10, 2),
               allowNull: false,
               defaultValue: 0.0,
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
         },
         {
            charset: "utf8mb4",
            collate: "utf8mb4_unicode_ci",
         }
      );
   },

   down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable("tickets");
   },
};
