"use strict";

function getRandomElement(arr, usedIds, key) {
   let element;
   do {
      element = arr[Math.floor(Math.random() * arr.length)];
   } while (usedIds.has(element[key]));
   usedIds.add(element[key]);
   return element;
}

module.exports = {
   up: async (queryInterface, Sequelize) => {
      const offices = await queryInterface.sequelize.query(`SELECT office_id from offices;`);
      const officeRows = offices[0];
      const ways = await queryInterface.sequelize.query(`SELECT way_id from ways;`);
      const wayRows = ways[0];

      const usedOfficeIds = new Set();
      const usedWayIds = new Set();

      return queryInterface.bulkInsert(
         "pickup_points",
         [
            // Tuyến 1: Office 1 - Office 2
            {
               pickup_point_way_id: getRandomElement(wayRows, usedWayIds, "way_id").way_id,
               pickup_point_office_id: getRandomElement(officeRows, usedOfficeIds, "office_id").office_id,
               pickup_point_name: "Điểm xuất phát Main Office 1",
               pickup_point_time: 25200000,
               pickup_point_kind: 0,
               pickup_point_description: "Điểm xuất phát đầu tuyến tại Main Office 1",
               point_kind_name: "Điểm xuất phát",
            },
            {
               pickup_point_way_id: getRandomElement(wayRows, usedWayIds, "way_id").way_id,
               pickup_point_office_id: getRandomElement(officeRows, usedOfficeIds, "office_id").office_id,
               pickup_point_name: "Điểm trả Main Office 2",
               pickup_point_time: 28800000,
               pickup_point_kind: 1,
               pickup_point_description: "Điểm trả cuối tuyến tại Main Office 2",
               point_kind_name: "Điểm trả",
            },
            {
               pickup_point_way_id: getRandomElement(wayRows, usedWayIds, "way_id").way_id,
               pickup_point_office_id: getRandomElement(officeRows, usedOfficeIds, "office_id").office_id,
               pickup_point_name: "Điểm đón Main Office 5",
               pickup_point_time: 54000000,
               pickup_point_kind: 0,
               pickup_point_description: "Điểm đón đầu tuyến tại Main Office 5",
               point_kind_name: "Điểm đón",
            },
            {
               pickup_point_way_id: getRandomElement(wayRows, usedWayIds, "way_id").way_id,
               pickup_point_office_id: getRandomElement(officeRows, usedOfficeIds, "office_id").office_id,
               pickup_point_name: "Điểm đến Main Office 6",
               pickup_point_time: 57600000,
               pickup_point_kind: -1,
               pickup_point_description: "Điểm đến cuối tuyến tại Main Office 6",
               point_kind_name: "Điểm đến",
            },
            {
               pickup_point_way_id: getRandomElement(wayRows, usedWayIds, "way_id").way_id,
               pickup_point_office_id: getRandomElement(officeRows, usedOfficeIds, "office_id").office_id,
               pickup_point_name: "Điểm đón Main Office 7",
               pickup_point_time: 61200000,
               pickup_point_kind: 0,
               pickup_point_description: "Điểm đón đầu tuyến tại Main Office 7",
               point_kind_name: "Điểm đón",
            },
            {
               pickup_point_way_id: getRandomElement(wayRows, usedWayIds, "way_id").way_id,
               pickup_point_office_id: getRandomElement(officeRows, usedOfficeIds, "office_id").office_id,
               pickup_point_name: "Điểm trả Main Office 8",
               pickup_point_time: 64800000,
               pickup_point_kind: 1,
               pickup_point_description: "Điểm trả cuối tuyến tại Main Office 8",
               point_kind_name: "Điểm trả",
            },
            {
               pickup_point_way_id: getRandomElement(wayRows, usedWayIds, "way_id").way_id,
               pickup_point_office_id: getRandomElement(officeRows, usedOfficeIds, "office_id").office_id,
               pickup_point_name: "Điểm đón Main Office 9",
               pickup_point_time: 68400000,
               pickup_point_kind: 0,
               pickup_point_description: "Điểm đón đầu tuyến tại Main Office 9",
               point_kind_name: "Điểm đón",
            },
            {
               pickup_point_way_id: getRandomElement(wayRows, usedWayIds, "way_id").way_id,
               pickup_point_office_id: getRandomElement(officeRows, usedOfficeIds, "office_id").office_id,
               pickup_point_name: "Điểm đến Main Office 10",
               pickup_point_time: 72000000,
               pickup_point_kind: -1,
               pickup_point_description: "Điểm đến cuối tuyến tại Main Office 10",
               point_kind_name: "Điểm đến",
            },
            {
               pickup_point_way_id: getRandomElement(wayRows, usedWayIds, "way_id").way_id,
               pickup_point_office_id: getRandomElement(officeRows, usedOfficeIds, "office_id").office_id,
               pickup_point_name: "Điểm đón Main Office 11",
               pickup_point_time: 75600000,
               pickup_point_kind: 0,
               pickup_point_description: "Điểm đón đầu tuyến tại Main Office 11",
               point_kind_name: "Điểm đón",
            },
            {
               pickup_point_way_id: getRandomElement(wayRows, usedWayIds, "way_id").way_id,
               pickup_point_office_id: getRandomElement(officeRows, usedOfficeIds, "office_id").office_id,
               pickup_point_name: "Điểm trả Main Office 12",
               pickup_point_time: 79200000,
               pickup_point_kind: 1,
               pickup_point_description: "Điểm trả cuối tuyến tại Main Office 12",
               point_kind_name: "Điểm trả",
            },
         ],
         {}
      );
   },

   down: async (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete("pickup_points", null, {});
   },
};
