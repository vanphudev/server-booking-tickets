"use strict";

function getRandomElement(arr) {
   return arr[Math.floor(Math.random() * arr.length)];
}

module.exports = {
   up: async (queryInterface, Sequelize) => {
      const employees = await queryInterface.sequelize.query(
         `SELECT e.employee_id 
          FROM employees e
          JOIN employee_types et ON e.employee_type_id = et.employee_type_id
          WHERE et.employee_type_name LIKE '%Tài xế%';`
      );
      const employeeRows = employees[0];

      if (employeeRows.length === 0) {
         console.log("No employees found with type 'Tài xế'. Skipping driver seeding.");
         return;
      }

      return queryInterface.bulkInsert(
         "drivers",
         [
            {
               driver_license_number: "79B1234567",
               driver_experience_years: 10,
               employee_id: getRandomElement(employeeRows).employee_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               driver_license_number: "79C2345678",
               driver_experience_years: 5,
               employee_id: getRandomElement(employeeRows).employee_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               driver_license_number: "79D3456789",
               driver_experience_years: 8,
               employee_id: getRandomElement(employeeRows).employee_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               driver_license_number: "79E4567890",
               driver_experience_years: 15,
               employee_id: getRandomElement(employeeRows).employee_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               driver_license_number: "79F5678901",
               driver_experience_years: 12,
               employee_id: getRandomElement(employeeRows).employee_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               driver_license_number: "79G6789012",
               driver_experience_years: 7,
               employee_id: getRandomElement(employeeRows).employee_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               driver_license_number: "79H7890123",
               driver_experience_years: 9,
               employee_id: getRandomElement(employeeRows).employee_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               driver_license_number: "79I8901234",
               driver_experience_years: 6,
               employee_id: getRandomElement(employeeRows).employee_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               driver_license_number: "79J9012345",
               driver_experience_years: 11,
               employee_id: getRandomElement(employeeRows).employee_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               driver_license_number: "79K0123456",
               driver_experience_years: 4,
               employee_id: getRandomElement(employeeRows).employee_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
         ],
         {}
      );
   },

   down: async (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete("drivers", null, {});
   },
};
