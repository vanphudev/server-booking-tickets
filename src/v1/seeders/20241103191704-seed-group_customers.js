"use strict";

function getRandomElement(arr) {
   return arr[Math.floor(Math.random() * arr.length)];
}

module.exports = {
   up: async (queryInterface, Sequelize) => {
      const groups = await queryInterface.sequelize.query("SELECT group_id FROM `groups`;");
      const groupRows = groups[0];
      const customers = await queryInterface.sequelize.query(`SELECT customer_id FROM customers;`);
      const customerRows = customers[0];

      const usedPairs = new Set();
      const records = [];

      while (records.length < 6) {
         // Số lượng bản ghi mong muốn
         const group = getRandomElement(groupRows).group_id;
         const customer = getRandomElement(customerRows).customer_id;
         const pairKey = `${group}-${customer}`;

         // Kiểm tra tính duy nhất của cặp (group_id, customer_id)
         if (!usedPairs.has(pairKey)) {
            usedPairs.add(pairKey);
            records.push({
               group_id: group,
               customer_id: customer,
               created_at: new Date(),
               updated_at: new Date(),
            });
         }
      }

      return queryInterface.bulkInsert("group_customers", records, {});
   },

   down: async (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete("group_customers", null, {});
   },
};
