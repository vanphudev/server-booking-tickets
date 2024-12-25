"use strict";

module.exports = {
   up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable(
         "vehicles",
         {
            vehicle_id: {
               type: Sequelize.INTEGER,
               autoIncrement: true,
               primaryKey: true,
            },
            vehicle_code: {
               type: Sequelize.STRING(255),
               allowNull: false,
               unique: true,
            },
            vehicle_license_plate: {
               type: Sequelize.STRING(255),
               allowNull: false,
               unique: true,
            },
            vehicle_model: {
               type: Sequelize.STRING(255),
            },
            vehicle_brand: {
               type: Sequelize.STRING(255),
            },
            vehicle_capacity: {
               type: Sequelize.INTEGER,
               allowNull: false,
               validate: {
                  min: 1,
               },
            },
            vehicle_manufacture_year: {
               type: Sequelize.INTEGER,
               validate: {
                  min: 1800,
               },
            },
            vehicle_image: {
               type: Sequelize.TEXT("long"),
               allowNull: true,
               validate: {
                  isBase64: true,
                  notEmpty: true,
               },
            },
            vehicle_color: {
               type: Sequelize.STRING(255),
            },
            vehicle_description: {
               type: Sequelize.STRING(500),
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
            map_vehicle_layout_id: {
               type: Sequelize.INTEGER,
               references: {
                  model: {
                     tableName: "map_vehicle_layouts",
                  },
                  key: "map_vehicle_layout_id",
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
         },
         {
            charset: "utf8mb4",
            collate: "utf8mb4_unicode_ci",
         }
      );
   },

   down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable("vehicles");
   },
};
