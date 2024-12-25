"use strict";

module.exports = {
   up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable(
         "trips",
         {
            trip_id: {
               type: Sequelize.INTEGER,
               autoIncrement: true,
               primaryKey: true,
            },
            trip_arrival_time: {
               type: Sequelize.DATE,
               allowNull: false,
               defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            trip_departure_time: {
               type: Sequelize.DATE,
               allowNull: false,
               defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
               validate: {
                  isAfter: Sequelize.literal("trip_arrival_time"),
               },
            },
            trip_date: {
               type: Sequelize.DATE,
               defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            trip_price: {
               type: Sequelize.DECIMAL(10, 2),
               defaultValue: 0.0,
               validate: {
                  min: 0,
               },
            },
            trip_discount: {
               type: Sequelize.DECIMAL(10, 2),
               defaultValue: 0.0,
               validate: {
                  min: 0,
                  isLessThanOrEqualToPrice(value) {
                     if (value > this.trip_price) {
                        throw new Error("Discount cannot exceed the price");
                     }
                  },
               },
            },
            trip_shuttle_enable: {
               type: Sequelize.TINYINT(1),
               defaultValue: 0,
               validate: {
                  isIn: [[0, 1]],
               },
            },
            allow_online_booking: {
               type: Sequelize.TINYINT(1),
               defaultValue: 0,
               validate: {
                  isIn: [[0, 1]],
               },
            },
            trip_holiday: {
               type: Sequelize.TINYINT(1),
               defaultValue: 0,
               validate: {
                  isIn: [[0, 1]],
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
            route_id: {
               type: Sequelize.INTEGER,
               allowNull: false,
               references: {
                  model: {
                     tableName: "routes",
                  },
                  key: "route_id",
               },
            },
            vehicle_id: {
               type: Sequelize.INTEGER,
               allowNull: false,
               references: {
                  model: {
                     tableName: "vehicles",
                  },
                  key: "vehicle_id",
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
      await queryInterface.dropTable("trips");
   },
};
