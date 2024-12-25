"use strict";

module.exports = {
   up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable(
         "offices",
         {
            office_id: {
               type: Sequelize.INTEGER,
               autoIncrement: true,
               primaryKey: true,
            },
            office_name: {
               type: Sequelize.STRING(500),
               allowNull: false,
               unique: true,
            },
            office_address: {
               type: Sequelize.TEXT("long"),
            },
            office_phone: {
               type: Sequelize.STRING(20),
               unique: true,
               allowNull: false,
               validate: {
                  isNumeric: true,
               },
            },
            office_fax: {
               type: Sequelize.STRING(20),
            },
            office_description: {
               type: Sequelize.TEXT("long"),
            },
            office_latitude: {
               type: Sequelize.TEXT("long"),
            },
            office_longitude: {
               type: Sequelize.TEXT("long"),
            },
            office_map_url: {
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
            ward_id: {
               type: Sequelize.STRING(50),
               references: {
                  model: {
                     tableName: "wards",
                  },
                  key: "ward_id",
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
      await queryInterface.dropTable("offices");
   },
};
