"use strict";

module.exports = {
   up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable(
         "booking_seats",
         {
            booking_seat_id: {
               type: Sequelize.INTEGER,
               autoIncrement: true,
               primaryKey: true,
            },
            trip_id: {
               type: Sequelize.INTEGER,
               allowNull: false,
               references: {
                  model: {
                     tableName: "trips",
                  },
                  key: "trip_id",
               },
            },
            seat_name: {
               type: Sequelize.STRING(255),
               allowNull: false,
            },
            booking_seat_status: {
               type: Sequelize.TINYINT,
               defaultValue: 0,
               validate: {
                  isIn: [[0, 1]],
               },
            },
            booking_expiration_time: {
               type: Sequelize.DATE,
               defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            is_locked: {
               type: Sequelize.TINYINT,
               defaultValue: 0,
               validate: {
                  isIn: [[0, 1]],
               },
            },
            map_vehicle_seat_id: {
               type: Sequelize.INTEGER,
               references: {
                  model: {
                     tableName: "map_vehicle_seats",
                  },
                  key: "map_vehicle_seat_id",
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
      await queryInterface.dropTable("booking_seats");
   },
};
