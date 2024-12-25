"use strict";

module.exports = {
   up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable(
         "reviews",
         {
            review_id: {
               type: Sequelize.INTEGER,
               autoIncrement: true,
               primaryKey: true,
            },
            review_rating: {
               type: Sequelize.INTEGER,
               defaultValue: 5,
               allowNull: false,
               validate: {
                  min: 1,
                  max: 5,
               },
            },
            review_date: {
               type: Sequelize.DATE,
               defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            review_comment: {
               type: Sequelize.TEXT("long"),
            },
            is_locked: {
               type: Sequelize.TINYINT,
               defaultValue: 0,
               validate: {
                  isIn: [[0, 1]],
               },
            },
            last_lock_at: {
               type: Sequelize.DATE,
               allowNull: true,
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
               references: {
                  model: {
                     tableName: "routes",
                  },
                  key: "route_id",
               },
            },
            customer_id: {
               type: Sequelize.INTEGER,
               allowNull: false,
               references: {
                  model: {
                     tableName: "customers",
                  },
                  key: "customer_id",
               },
            },
            trip_id: {
               type: Sequelize.INTEGER,
               allowNull: true,
               references: {
                  model: {
                     tableName: "trips",
                  },
                  key: "trip_id",
               },
            },
            booking_id: {
               type: Sequelize.INTEGER,
               allowNull: true,
               unique: true,
               references: {
                  model: {
                     tableName: "booking_tickets",
                  },
                  key: "booking_id",
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
      await queryInterface.dropTable("reviews");
   },
};
