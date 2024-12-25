"use strict";

function getRandomElement(arr) {
   return arr[Math.floor(Math.random() * arr.length)];
}

module.exports = {
   up: async (queryInterface, Sequelize) => {
      const roles = await queryInterface.sequelize.query(`SELECT role_id FROM roles;`);
      const roleRows = roles[0];
      const groups = await queryInterface.sequelize.query("SELECT group_id FROM `groups`;");
      const groupRows = groups[0];

      const uniquePairs = new Set();
      const records = [];

      while (records.length < 6) {
         // Số bản ghi muốn tạo
         const role = getRandomElement(roleRows).role_id;
         const group = getRandomElement(groupRows).group_id;
         const pairKey = `${role}-${group}`;

         // Kiểm tra nếu cặp (role_id, group_id) đã tồn tại
         if (!uniquePairs.has(pairKey)) {
            uniquePairs.add(pairKey);
            records.push({
               role_id: role,
               group_id: group,
               created_at: new Date(),
               updated_at: new Date(),
            });
         }
      }

      return queryInterface.bulkInsert("role_groups", records, {});
   },

   down: async (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete("role_groups", null, {});
   },
};
