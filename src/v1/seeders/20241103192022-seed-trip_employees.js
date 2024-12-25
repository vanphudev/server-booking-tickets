"use strict";

function getRandomElement(arr, usedPairs, key) {
   let element;
   do {
      element = arr[Math.floor(Math.random() * arr.length)];
   } while (usedPairs.has(element[key]));
   usedPairs.add(element[key]);
   return element;
}

module.exports = {
   up: async (queryInterface, Sequelize) => {
      const trips = await queryInterface.sequelize.query(`SELECT trip_id FROM trips;`);
      const tripRows = trips[0];
      const employees = await queryInterface.sequelize.query(`SELECT employee_id FROM employees;`);
      const employeeRows = employees[0];

      const usedTripEmployeePairs = new Set();

      return queryInterface.bulkInsert(
         "trip_employees",
         Array.from({length: 5}, () => {
            const trip = getRandomElement(tripRows, usedTripEmployeePairs, "trip_id");
            const employee = getRandomElement(employeeRows, usedTripEmployeePairs, "employee_id");
            const pairKey = `${trip.trip_id}-${employee.employee_id}`;

            if (usedTripEmployeePairs.has(pairKey)) {
               return null; // Skip if the pair is already used
            }

            usedTripEmployeePairs.add(pairKey);

            return {
               trip_id: trip.trip_id,
               employee_id: employee.employee_id,
               created_at: new Date(),
               updated_at: new Date(),
            };
         }).filter(Boolean), // Remove null entries
         {}
      );
   },

   down: async (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete("trip_employees", null, {});
   },
};
