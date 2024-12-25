"use strict";

function getRandomElement(arr) {
   return arr[Math.floor(Math.random() * (arr.length - 1))];
}

module.exports = {
   up: async (queryInterface, Sequelize) => {
      const offices = await queryInterface.sequelize.query(`SELECT office_id FROM offices;`);
      const officeRows = offices[0];
      const vehicleTypes = await queryInterface.sequelize.query(`SELECT vehicle_type_id FROM vehicle_types;`);
      const vehicleTypeRows = vehicleTypes[0];
      const layouts = await queryInterface.sequelize.query(`SELECT map_vehicle_layout_id FROM map_vehicle_layouts;`);
      const layoutRows = layouts[0];

      return queryInterface.bulkInsert(
         "vehicles",
         [
            {
               vehicle_code: "VHC001",
               vehicle_license_plate: "29A-12345",
               vehicle_model: "Model S",
               vehicle_brand: "Tesla",
               vehicle_capacity: 5,
               vehicle_manufacture_year: 2020,
               vehicle_color: "Red",
               vehicle_description: "Electric sedan with autopilot.",
               is_locked: 0,
               map_vehicle_layout_id: getRandomElement(layoutRows).map_vehicle_layout_id,
               office_id: getRandomElement(officeRows).office_id,
               vehicle_type_id: getRandomElement(vehicleTypeRows).vehicle_type_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               vehicle_code: "VHC002",
               vehicle_license_plate: "30B-67890",
               vehicle_model: "Civic",
               vehicle_brand: "Honda",
               vehicle_capacity: 5,
               vehicle_manufacture_year: 2018,
               vehicle_color: "Blue",
               vehicle_description: "Compact car with great fuel efficiency.",
               is_locked: 0,
               map_vehicle_layout_id: getRandomElement(layoutRows).map_vehicle_layout_id,
               office_id: getRandomElement(officeRows).office_id,
               vehicle_type_id: getRandomElement(vehicleTypeRows).vehicle_type_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               vehicle_code: "VHC003",
               vehicle_license_plate: "31C-11223",
               vehicle_model: "Corolla",
               vehicle_brand: "Toyota",
               vehicle_capacity: 5,
               vehicle_manufacture_year: 2019,
               vehicle_color: "White",
               vehicle_description: "Reliable sedan with advanced safety features.",
               is_locked: 0,
               map_vehicle_layout_id: getRandomElement(layoutRows).map_vehicle_layout_id,
               office_id: getRandomElement(officeRows).office_id,
               vehicle_type_id: getRandomElement(vehicleTypeRows).vehicle_type_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               vehicle_code: "VHC004",
               vehicle_license_plate: "32D-44556",
               vehicle_model: "Mustang",
               vehicle_brand: "Ford",
               vehicle_capacity: 4,
               vehicle_manufacture_year: 2021,
               vehicle_color: "Black",
               vehicle_description: "Sporty coupe with powerful engine.",
               is_locked: 0,
               map_vehicle_layout_id: getRandomElement(layoutRows).map_vehicle_layout_id,
               office_id: getRandomElement(officeRows).office_id,
               vehicle_type_id: getRandomElement(vehicleTypeRows).vehicle_type_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               vehicle_code: "VHC005",
               vehicle_license_plate: "33E-77889",
               vehicle_model: "Accord",
               vehicle_brand: "Honda",
               vehicle_capacity: 5,
               vehicle_manufacture_year: 2017,
               vehicle_color: "Silver",
               vehicle_description: "Midsize sedan with spacious interior.",
               is_locked: 0,
               map_vehicle_layout_id: getRandomElement(layoutRows).map_vehicle_layout_id,
               office_id: getRandomElement(officeRows).office_id,
               vehicle_type_id: getRandomElement(vehicleTypeRows).vehicle_type_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
         ],
         {}
      );
   },

   down: async (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete("vehicles", null, {});
   },
};
