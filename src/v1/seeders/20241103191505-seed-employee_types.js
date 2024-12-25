"use strict";

module.exports = {
   up: async (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert(
         "employee_types",
         [
            {
               employee_type_name: "Quản lý",
               employee_type_description: "Chịu trách nhiệm quản lý hoạt động của nhân viên.",
            },
            {
               employee_type_name: "Nhân viên bán vé",
               employee_type_description: "Chịu trách nhiệm bán vé cho khách hàng.",
            },
            {
               employee_type_name: "Tài xế",
               employee_type_description: "Chịu trách nhiệm lái xe và đảm bảo an toàn cho hành khách.",
            },
            {
               employee_type_name: "Nhân viên bảo trì",
               employee_type_description: "Chịu trách nhiệm bảo trì và sửa chữa phương tiện.",
            },
            {
               employee_type_name: "Nhân viên hỗ trợ khách hàng",
               employee_type_description: "Chịu trách nhiệm hỗ trợ khách hàng và giải quyết thắc mắc.",
            },
         ],
         {}
      );
   },

   down: async (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete("employee_types", null, {});
   },
};
