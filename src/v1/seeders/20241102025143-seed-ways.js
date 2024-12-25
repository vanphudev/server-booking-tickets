"use strict";

module.exports = {
   up: async (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert(
         "ways",
         [
            {
               way_name: "Tuyến 1: Main Office 1 - Main Office 2",
               way_description: "Tuyến xe từ Main Office 1 đến Main Office 2",
            },
            {
               way_name: "Tuyến 2: Main Office 2 - Main Office 3",
               way_description: "Tuyến xe từ Main Office 2 đến Main Office 3",
            },
            {
               way_name: "Tuyến 3: Main Office 3 - Main Office 4",
               way_description: "Tuyến xe từ Main Office 3 đến Main Office 4",
            },
            {
               way_name: "Tuyến 4: Main Office 4 - Main Office 5",
               way_description: "Tuyến xe từ Main Office 4 đến Main Office 5",
            },
            {
               way_name: "Tuyến 5: Main Office 5 - Main Office 6",
               way_description: "Tuyến xe từ Main Office 5 đến Main Office 6",
            },
            {
               way_name: "Tuyến 6: Main Office 6 - Main Office 1",
               way_description: "Tuyến xe từ Main Office 6 đến Main Office 1",
            },
            {
               way_name: "Tuyến 7: Main Office 1 - Main Office 2",
               way_description: "Tuyến xe từ Main Office 1 đến Main Office 2",
            },
            {
               way_name: "Tuyến 8: Main Office 2 - Main Office 3",
               way_description: "Tuyến xe từ Main Office 2 đến Main Office 3",
            },
            {
               way_name: "Tuyến 9: Main Office 3 - Main Office 4",
               way_description: "Tuyến xe từ Main Office 3 đến Main Office 4",
            },
            {
               way_name: "Tuyến 10: Main Office 4 - Main Office 5",
               way_description: "Tuyến xe từ Main Office 4 đến Main Office 5",
            },
         ],
         {}
      );
   },

   down: async (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete("ways", null, {});
   },
};
