"use strict";

module.exports = {
   up: async (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert(
         "payment_types",
         [
            {
               payment_type_name: "Credit Card",
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               payment_type_name: "PayPal",
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               payment_type_name: "Bank Transfer",
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               payment_type_name: "Cash",
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               payment_type_name: "Mobile Payment",
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               payment_type_name: "Cryptocurrency",
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               payment_type_name: "Gift Card",
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               payment_type_name: "Cheque",
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               payment_type_name: "Direct Debit",
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               payment_type_name: "Apple Pay",
               created_at: new Date(),
               updated_at: new Date(),
            },
         ],
         {}
      );
   },

   down: async (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete("payment_types", null, {});
   },
};
