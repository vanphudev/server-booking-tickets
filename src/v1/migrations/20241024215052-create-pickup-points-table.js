"use strict";

module.exports = {
   up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable(
         "pickup_points",
         {
            pickup_point_way_id: {
               type: Sequelize.INTEGER,
               allowNull: false,
               primaryKey: true,
               references: {
                  model: {
                     tableName: "ways",
                  },
                  key: "way_id",
               },
            },
            pickup_point_office_id: {
               type: Sequelize.INTEGER,
               allowNull: false,
               primaryKey: true,
               references: {
                  model: {
                     tableName: "offices",
                  },
                  key: "office_id",
               },
            },
            pickup_point_name: {
               type: Sequelize.STRING(500),
               allowNull: false,
            },
            pickup_point_time: {
               type: Sequelize.BIGINT,
               allowNull: true,
               validate: {
                  min: 0,
               },
            },
            pickup_point_kind: {
               type: Sequelize.TINYINT(1),
               validate: {
                  isIn: [[0, 1]],
               },
            },
            pickup_point_description: {
               type: Sequelize.STRING(500),
               allowNull: true,
            },
            point_kind_name: {
               type: Sequelize.STRING(500),
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
         },
         {
            charset: "utf8mb4",
            collate: "utf8mb4_unicode_ci",
         }
      );
   },

   down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable("pickup_points");
   },
};
