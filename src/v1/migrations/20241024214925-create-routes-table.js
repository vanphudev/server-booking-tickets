"use strict";

module.exports = {
   up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable(
         "routes",
         {
            route_id: {
               type: Sequelize.INTEGER,
               autoIncrement: true,
               primaryKey: true,
            },
            route_name: {
               type: Sequelize.STRING(500),
               allowNull: false,
               unique: true,
            },
            route_duration: {
               type: Sequelize.BIGINT,
               allowNull: true,
               validate: {
                  min: 0,
               },
            },
            route_distance: {
               type: Sequelize.BIGINT,
               allowNull: true,
               validate: {
                  min: 0,
               },
            },
            route_url_gps: {
               type: Sequelize.TEXT("long"),
               allowNull: true,
            },
            origin_office_id: {
               type: Sequelize.INTEGER,
               allowNull: true,
               references: {
                  model: {
                     tableName: "offices",
                  },
                  key: "office_id",
               },
            },
            destination_office_id: {
               type: Sequelize.INTEGER,
               allowNull: true,
               references: {
                  model: {
                     tableName: "offices",
                  },
                  key: "office_id",
               },
            },
            route_price: {
               type: Sequelize.DECIMAL(10, 2),
               defaultValue: 0.0,
               validate: {
                  min: 0,
               },
            },
            is_default: {
               type: Sequelize.TINYINT,
               defaultValue: 0,
               validate: {
                  isIn: [[0, 1]],
               },
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
            way_id: {
               type: Sequelize.INTEGER,
               allowNull: true,
               references: {
                  model: {
                     tableName: "ways",
                  },
                  key: "way_id",
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
      await queryInterface.dropTable("routes");
   },
};
