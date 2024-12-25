"use strict";

module.exports = {
   up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable(
         "map_vehicle_seats",
         {
            map_vehicle_seat_id: {
               type: Sequelize.INTEGER,
               autoIncrement: true,
               primaryKey: true,
            },
            map_vehicle_seat_code: {
               type: Sequelize.STRING(255),
               allowNull: false,
            },
            map_vehicle_seat_row_no: {
               type: Sequelize.INTEGER,
               allowNull: false,
               validate: {
                  min: 1,
               },
            },
            map_vehicle_seat_column_no: {
               type: Sequelize.INTEGER,
               allowNull: false,
               validate: {
                  min: 1,
               },
            },
            map_vehicle_seat_floor_no: {
               type: Sequelize.INTEGER,
               allowNull: false,
               validate: {
                  min: 0,
               },
            },
            map_vehicle_seat_lock_chair: {
               type: Sequelize.TINYINT,
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
            map_vehicle_layout_id: {
               type: Sequelize.INTEGER,
               references: {
                  model: {
                     tableName: "map_vehicle_layouts",
                  },
                  key: "map_vehicle_layout_id",
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
      await queryInterface.dropTable("map_vehicle_seats");
   },
};
