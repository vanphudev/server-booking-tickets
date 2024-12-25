"use strict";

module.exports = {
   up: async (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert(
         "customer_types",
         [
            {
               customer_type_name: "Khách hàng vãng lai",
               customer_type_description: "Khách hàng chưa đăng nhập vào hệ thống nhưng vẫn có thể đặt vé được.",
            },
            {
               customer_type_name: "Khách hàng",
               customer_type_description: "Khách hàng đã có tài khoản trên hệ thống.",
            },
         ],
         {}
      );
   },

   down: async (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete("customer_types", null, {});
   },
};
