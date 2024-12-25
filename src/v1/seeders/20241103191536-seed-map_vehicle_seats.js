"use strict";

function getRandomElement(arr) {
   return arr[Math.floor(Math.random() * (arr.length - 1))];
}

module.exports = {
   up: async (queryInterface, Sequelize) => {
      const layouts = await queryInterface.sequelize.query(`SELECT map_vehicle_layout_id FROM map_vehicle_layouts;`);
      const layoutRows = layouts[0];

      return queryInterface.bulkInsert(
         "map_vehicle_seats",
         [
            {
               map_vehicle_seat_code: "A1",
               map_vehicle_seat_row_no: 1,
               map_vehicle_seat_column_no: 1,
               map_vehicle_seat_floor_no: 0,
               map_vehicle_seat_lock_chair: 0,
               map_vehicle_layout_id: getRandomElement(layoutRows).map_vehicle_layout_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               map_vehicle_seat_code: "A2",
               map_vehicle_seat_row_no: 1,
               map_vehicle_seat_column_no: 2,
               map_vehicle_seat_floor_no: 0,
               map_vehicle_seat_lock_chair: 0,
               map_vehicle_layout_id: getRandomElement(layoutRows).map_vehicle_layout_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               map_vehicle_seat_code: "B1",
               map_vehicle_seat_row_no: 2,
               map_vehicle_seat_column_no: 1,
               map_vehicle_seat_floor_no: 0,
               map_vehicle_seat_lock_chair: 0,
               map_vehicle_layout_id: getRandomElement(layoutRows).map_vehicle_layout_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               map_vehicle_seat_code: "B2",
               map_vehicle_seat_row_no: 2,
               map_vehicle_seat_column_no: 2,
               map_vehicle_seat_floor_no: 0,
               map_vehicle_seat_lock_chair: 0,
               map_vehicle_layout_id: getRandomElement(layoutRows).map_vehicle_layout_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               map_vehicle_seat_code: "C1",
               map_vehicle_seat_row_no: 3,
               map_vehicle_seat_column_no: 1,
               map_vehicle_seat_floor_no: 0,
               map_vehicle_seat_lock_chair: 0,
               map_vehicle_layout_id: getRandomElement(layoutRows).map_vehicle_layout_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               map_vehicle_seat_code: "C2",
               map_vehicle_seat_row_no: 3,
               map_vehicle_seat_column_no: 2,
               map_vehicle_seat_floor_no: 0,
               map_vehicle_seat_lock_chair: 0,
               map_vehicle_layout_id: getRandomElement(layoutRows).map_vehicle_layout_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               map_vehicle_seat_code: "D1",
               map_vehicle_seat_row_no: 4,
               map_vehicle_seat_column_no: 1,
               map_vehicle_seat_floor_no: 0,
               map_vehicle_seat_lock_chair: 0,
               map_vehicle_layout_id: getRandomElement(layoutRows).map_vehicle_layout_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               map_vehicle_seat_code: "D2",
               map_vehicle_seat_row_no: 4,
               map_vehicle_seat_column_no: 2,
               map_vehicle_seat_floor_no: 0,
               map_vehicle_seat_lock_chair: 0,
               map_vehicle_layout_id: getRandomElement(layoutRows).map_vehicle_layout_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               map_vehicle_seat_code: "E1",
               map_vehicle_seat_row_no: 5,
               map_vehicle_seat_column_no: 1,
               map_vehicle_seat_floor_no: 0,
               map_vehicle_seat_lock_chair: 0,
               map_vehicle_layout_id: getRandomElement(layoutRows).map_vehicle_layout_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               map_vehicle_seat_code: "E2",
               map_vehicle_seat_row_no: 5,
               map_vehicle_seat_column_no: 2,
               map_vehicle_seat_floor_no: 0,
               map_vehicle_seat_lock_chair: 0,
               map_vehicle_layout_id: getRandomElement(layoutRows).map_vehicle_layout_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
         ],
         {}
      );
   },

   down: async (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete("map_vehicle_seats", null, {});
   },
};
