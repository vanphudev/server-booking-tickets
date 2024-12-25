"use strict";

function getRandomElement(arr) {
   return arr[Math.floor(Math.random() * arr.length)];
}

module.exports = {
   up: async (queryInterface, Sequelize) => {
      const groups = await queryInterface.sequelize.query("SELECT group_id FROM `groups`;");
      const groupRows = groups[0];
      const employees = await queryInterface.sequelize.query(`SELECT employee_id FROM employees;`);
      const employeeRows = employees[0];

      const usedPairs = new Set();
      const records = [];

      while (records.length < 6) {
         // Số lượng bản ghi mong muốn
         const group = getRandomElement(groupRows).group_id;
         const employee = getRandomElement(employeeRows).employee_id;
         const pairKey = `${group}-${employee}`;

         // Kiểm tra tính duy nhất của cặp (group_id, employee_id)
         if (!usedPairs.has(pairKey)) {
            usedPairs.add(pairKey);
            records.push({
               group_id: group,
               employee_id: employee,
               created_at: new Date(),
               updated_at: new Date(),
            });
         }
      }

      return queryInterface.bulkInsert("group_employees", records, {});
   },

   down: async (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete("group_employees", null, {});
   },
};
