"use strict";

function getRandomElement(arr) {
   return arr[Math.floor(Math.random() * (arr.length - 1))];
}

module.exports = {
   up: async (queryInterface, Sequelize) => {
      const employees = await queryInterface.sequelize.query(`SELECT employee_id FROM employees;`);
      const employeeRows = employees[0];

      return queryInterface.bulkInsert(
         "vouchers",
         [
            {
               voucher_code: "DISCOUNT10",
               voucher_discount_percentage: 10.0,
               voucher_discount_max_amount: 50.0,
               voucher_usage_limit: 100,
               voucher_valid_from: new Date(),
               voucher_valid_to: new Date(new Date().setMonth(new Date().getMonth() + 1)),
               voucher_created_by: getRandomElement(employeeRows).employee_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               voucher_code: "SUMMER20",
               voucher_discount_percentage: 20.0,
               voucher_discount_max_amount: 100.0,
               voucher_usage_limit: 50,
               voucher_valid_from: new Date(),
               voucher_valid_to: new Date(new Date().setMonth(new Date().getMonth() + 2)),
               voucher_created_by: getRandomElement(employeeRows).employee_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               voucher_code: "WELCOME5",
               voucher_discount_percentage: 5.0,
               voucher_discount_max_amount: 20.0,
               voucher_usage_limit: 200,
               voucher_valid_from: new Date(),
               voucher_valid_to: new Date(new Date().setMonth(new Date().getMonth() + 3)),
               voucher_created_by: getRandomElement(employeeRows).employee_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               voucher_code: "HOLIDAY15",
               voucher_discount_percentage: 15.0,
               voucher_discount_max_amount: 75.0,
               voucher_usage_limit: 75,
               voucher_valid_from: new Date(),
               voucher_valid_to: new Date(new Date().setMonth(new Date().getMonth() + 1)),
               voucher_created_by: getRandomElement(employeeRows).employee_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               voucher_code: "BLACKFRIDAY",
               voucher_discount_percentage: 30.0,
               voucher_discount_max_amount: 150.0,
               voucher_usage_limit: 30,
               voucher_valid_from: new Date(),
               voucher_valid_to: new Date(new Date().setMonth(new Date().getMonth() + 1)),
               voucher_created_by: getRandomElement(employeeRows).employee_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               voucher_code: "NEWYEAR25",
               voucher_discount_percentage: 25.0,
               voucher_discount_max_amount: 125.0,
               voucher_usage_limit: 40,
               voucher_valid_from: new Date(),
               voucher_valid_to: new Date(new Date().setMonth(new Date().getMonth() + 1)),
               voucher_created_by: getRandomElement(employeeRows).employee_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               voucher_code: "SPRINGSALE",
               voucher_discount_percentage: 15.0,
               voucher_discount_max_amount: 60.0,
               voucher_usage_limit: 60,
               voucher_valid_from: new Date(),
               voucher_valid_to: new Date(new Date().setMonth(new Date().getMonth() + 1)),
               voucher_created_by: getRandomElement(employeeRows).employee_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               voucher_code: "FALL10",
               voucher_discount_percentage: 10.0,
               voucher_discount_max_amount: 40.0,
               voucher_usage_limit: 80,
               voucher_valid_from: new Date(),
               voucher_valid_to: new Date(new Date().setMonth(new Date().getMonth() + 1)),
               voucher_created_by: getRandomElement(employeeRows).employee_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               voucher_code: "WINTERSALE",
               voucher_discount_percentage: 20.0,
               voucher_discount_max_amount: 90.0,
               voucher_usage_limit: 90,
               voucher_valid_from: new Date(),
               voucher_valid_to: new Date(new Date().setMonth(new Date().getMonth() + 1)),
               voucher_created_by: getRandomElement(employeeRows).employee_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               voucher_code: "CYBERMONDAY",
               voucher_discount_percentage: 35.0,
               voucher_discount_max_amount: 200.0,
               voucher_usage_limit: 25,
               voucher_valid_from: new Date(),
               voucher_valid_to: new Date(new Date().setMonth(new Date().getMonth() + 1)),
               voucher_created_by: getRandomElement(employeeRows).employee_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
         ],
         {}
      );
   },

   down: async (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete("vouchers", null, {});
   },
};
