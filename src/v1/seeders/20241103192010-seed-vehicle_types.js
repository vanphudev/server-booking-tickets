"use strict";

module.exports = {
   up: async (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert(
         "vehicle_types",
         [
            {
               vehicle_type_name: "Sedan",
               vehicle_type_description: "A small to medium-sized passenger car.",
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               vehicle_type_name: "SUV",
               vehicle_type_description: "Sport Utility Vehicle, a rugged vehicle with a truck-like chassis.",
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               vehicle_type_name: "Hatchback",
               vehicle_type_description: "A car with a hatch-type rear door that opens upwards.",
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               vehicle_type_name: "Convertible",
               vehicle_type_description:
                  "A car with a roof structure that can be 'converted' to allow open-air or enclosed driving.",
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               vehicle_type_name: "Coupe",
               vehicle_type_description: "A car with a fixed-roof body style that is shorter than a sedan.",
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               vehicle_type_name: "Minivan",
               vehicle_type_description: "A van designed for personal use.",
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               vehicle_type_name: "Pickup Truck",
               vehicle_type_description:
                  "A light-duty truck having an enclosed cab and an open cargo area with low sides and tailgate.",
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               vehicle_type_name: "Van",
               vehicle_type_description: "A type of road vehicle used for transporting goods or people.",
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               vehicle_type_name: "Bus",
               vehicle_type_description: "A large motor vehicle carrying passengers by road.",
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               vehicle_type_name: "Motorcycle",
               vehicle_type_description: "A two-wheeled motor vehicle that is powered by an engine.",
               created_at: new Date(),
               updated_at: new Date(),
            },
         ],
         {}
      );
   },

   down: async (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete("vehicle_types", null, {});
   },
};
