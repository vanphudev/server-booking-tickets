"use strict";

function getRandomElement(arr) {
   return arr[Math.floor(Math.random() * arr.length)];
}

module.exports = {
   up: async (queryInterface, Sequelize) => {
      const paymentMethods = await queryInterface.sequelize.query(`SELECT payment_method_id FROM payment_methods;`);
      const paymentMethodRows = paymentMethods[0];

      // Tạo một Set để lưu các payment_method_id đã sử dụng
      const usedPaymentMethodIds = new Set();

      const insertData = Array.from({length: 10}, (_, index) => {
         let paymentMethod;

         // Chọn một paymentMethod chưa được sử dụng
         do {
            paymentMethod = getRandomElement(paymentMethodRows);
         } while (usedPaymentMethodIds.has(paymentMethod.payment_method_id));

         usedPaymentMethodIds.add(paymentMethod.payment_method_id);

         return {
            api_key: `api_key_${index + 1}`,
            secret_key: `secret_key_${index + 1}`,
            public_key: `public_key_${index + 1}`,
            payment_endpoint_url: `https://api.example.com/payment${index + 1}`,
            transaction_timeout: 30,
            environment: index % 2 === 0 ? "development" : "production",
            payment_method_id: paymentMethod.payment_method_id,
            created_at: new Date(),
            updated_at: new Date(),
         };
      });

      return queryInterface.bulkInsert("payment_configs", insertData, {});
   },

   down: async (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete("payment_configs", null, {});
   },
};
