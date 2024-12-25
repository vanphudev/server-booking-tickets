"use strict";

function getRandomElement(arr) {
   return arr[Math.floor(Math.random() * (arr.length - 1))];
}

module.exports = {
   up: async (queryInterface, Sequelize) => {
      const paymentTypes = await queryInterface.sequelize.query(`SELECT payment_type_id FROM payment_types;`);
      const paymentTypeRows = paymentTypes[0];

      return queryInterface.bulkInsert(
         "payment_methods",
         [
            {
               payment_method_code: "PM001",
               payment_method_name: "Credit Card",
               payment_method_avatar_url: "http://example.com/credit-card-avatar.jpg",
               payment_method_avatar_public_id: "credit-card-avatar",
               is_locked: 0,
               payment_method_description: "Pay using credit card.",
               payment_type_id: getRandomElement(paymentTypeRows).payment_type_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               payment_method_code: "PM002",
               payment_method_name: "PayPal",
               payment_method_avatar_url: "http://example.com/paypal-avatar.jpg",
               payment_method_avatar_public_id: "paypal-avatar",
               is_locked: 0,
               payment_method_description: "Pay using PayPal account.",
               payment_type_id: getRandomElement(paymentTypeRows).payment_type_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               payment_method_code: "PM003",
               payment_method_name: "Bank Transfer",
               payment_method_avatar_url: "http://example.com/bank-transfer-avatar.jpg",
               payment_method_avatar_public_id: "bank-transfer-avatar",
               is_locked: 0,
               payment_method_description: "Pay via bank transfer.",
               payment_type_id: getRandomElement(paymentTypeRows).payment_type_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               payment_method_code: "PM004",
               payment_method_name: "Cash",
               payment_method_avatar_url: "http://example.com/cash-avatar.jpg",
               payment_method_avatar_public_id: "cash-avatar",
               is_locked: 0,
               payment_method_description: "Pay with cash upon delivery.",
               payment_type_id: getRandomElement(paymentTypeRows).payment_type_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               payment_method_code: "PM005",
               payment_method_name: "Mobile Payment",
               payment_method_avatar_url: "http://example.com/mobile-payment-avatar.jpg",
               payment_method_avatar_public_id: "mobile-payment-avatar",
               is_locked: 0,
               payment_method_description: "Pay using mobile payment apps.",
               payment_type_id: getRandomElement(paymentTypeRows).payment_type_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               payment_method_code: "PM006",
               payment_method_name: "Cryptocurrency",
               payment_method_avatar_url: "http://example.com/crypto-avatar.jpg",
               payment_method_avatar_public_id: "crypto-avatar",
               is_locked: 0,
               payment_method_description: "Pay using cryptocurrency.",
               payment_type_id: getRandomElement(paymentTypeRows).payment_type_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               payment_method_code: "PM007",
               payment_method_name: "Gift Card",
               payment_method_avatar_url: "http://example.com/gift-card-avatar.jpg",
               payment_method_avatar_public_id: "gift-card-avatar",
               is_locked: 0,
               payment_method_description: "Pay using gift card.",
               payment_type_id: getRandomElement(paymentTypeRows).payment_type_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               payment_method_code: "PM008",
               payment_method_name: "Cheque",
               payment_method_avatar_url: "http://example.com/cheque-avatar.jpg",
               payment_method_avatar_public_id: "cheque-avatar",
               is_locked: 0,
               payment_method_description: "Pay using cheque.",
               payment_type_id: getRandomElement(paymentTypeRows).payment_type_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               payment_method_code: "PM009",
               payment_method_name: "Direct Debit",
               payment_method_avatar_url: "http://example.com/direct-debit-avatar.jpg",
               payment_method_avatar_public_id: "direct-debit-avatar",
               is_locked: 0,
               payment_method_description: "Pay using direct debit.",
               payment_type_id: getRandomElement(paymentTypeRows).payment_type_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               payment_method_code: "PM010",
               payment_method_name: "Apple Pay",
               payment_method_avatar_url: "http://example.com/apple-pay-avatar.jpg",
               payment_method_avatar_public_id: "apple-pay-avatar",
               is_locked: 0,
               payment_method_description: "Pay using Apple Pay.",
               payment_type_id: getRandomElement(paymentTypeRows).payment_type_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
         ],
         {}
      );
   },

   down: async (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete("payment_methods", null, {});
   },
};
