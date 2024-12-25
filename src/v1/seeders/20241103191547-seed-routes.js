"use strict";

function getRandomElement(arr) {
   return arr[Math.floor(Math.random() * (arr.length - 1))];
}

module.exports = {
   up: async (queryInterface, Sequelize) => {
      const offices = await queryInterface.sequelize.query(`SELECT office_id FROM offices;`);
      const officeRows = offices[0];
      const ways = await queryInterface.sequelize.query(`SELECT way_id FROM ways;`);
      const wayRows = ways[0];

      return queryInterface.bulkInsert(
         "routes",
         [
            {
               route_name: "Hà Nội - Hải Phòng",
               route_duration: 120,
               route_distance: 100,
               route_url_gps: "http://example.com/route1",
               origin_office_id: getRandomElement(officeRows).office_id,
               destination_office_id: getRandomElement(officeRows).office_id,
               route_price: 150000.0,
               is_default: 1,
               is_locked: 0,
               way_id: getRandomElement(wayRows).way_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               route_name: "Đà Nẵng - Huế",
               route_duration: 180,
               route_distance: 120,
               route_url_gps: "http://example.com/route2",
               origin_office_id: getRandomElement(officeRows).office_id,
               destination_office_id: getRandomElement(officeRows).office_id,
               route_price: 200000.0,
               is_default: 0,
               is_locked: 0,
               way_id: getRandomElement(wayRows).way_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               route_name: "Sài Gòn - Vũng Tàu",
               route_duration: 150,
               route_distance: 90,
               route_url_gps: "http://example.com/route3",
               origin_office_id: getRandomElement(officeRows).office_id,
               destination_office_id: getRandomElement(officeRows).office_id,
               route_price: 180000.0,
               is_default: 0,
               is_locked: 0,
               way_id: getRandomElement(wayRows).way_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               route_name: "Cần Thơ - Cà Mau",
               route_duration: 240,
               route_distance: 150,
               route_url_gps: "http://example.com/route4",
               origin_office_id: getRandomElement(officeRows).office_id,
               destination_office_id: getRandomElement(officeRows).office_id,
               route_price: 250000.0,
               is_default: 0,
               is_locked: 0,
               way_id: getRandomElement(wayRows).way_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               route_name: "Nha Trang - Đà Lạt",
               route_duration: 210,
               route_distance: 130,
               route_url_gps: "http://example.com/route5",
               origin_office_id: getRandomElement(officeRows).office_id,
               destination_office_id: getRandomElement(officeRows).office_id,
               route_price: 220000.0,
               is_default: 0,
               is_locked: 0,
               way_id: getRandomElement(wayRows).way_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
         ],
         {}
      );
   },

   down: async (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete("routes", null, {});
   },
};
