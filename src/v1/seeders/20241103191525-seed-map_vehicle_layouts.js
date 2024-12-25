"use strict";

module.exports = {
   up: async (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert(
         "map_vehicle_layouts",
         [
            {
               layout_name: "Standard Bus Layout",
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               layout_name: "Luxury Coach Layout",
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               layout_name: "Mini Van Layout",
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               layout_name: "Double Decker Layout",
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               layout_name: "Sleeper Bus Layout",
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               layout_name: "City Bus Layout",
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               layout_name: "Tourist Bus Layout",
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               layout_name: "School Bus Layout",
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               layout_name: "Airport Shuttle Layout",
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               layout_name: "Executive Coach Layout",
               created_at: new Date(),
               updated_at: new Date(),
            },
         ],
         {}
      );
   },

   down: async (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete("map_vehicle_layouts", null, {});
   },
};
