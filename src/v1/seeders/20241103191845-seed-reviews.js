"use strict";

function getRandomElement(arr) {
   return arr[Math.floor(Math.random() * (arr.length - 1))];
}

module.exports = {
   up: async (queryInterface, Sequelize) => {
      const routes = await queryInterface.sequelize.query(`SELECT route_id FROM routes;`);
      const routeRows = routes[0];
      const customers = await queryInterface.sequelize.query(`SELECT customer_id FROM customers;`);
      const customerRows = customers[0];

      return queryInterface.bulkInsert(
         "reviews",
         [
            {
               review_rating: 5,
               review_date: new Date(),
               review_comment: "Excellent service and smooth ride!",
               is_locked: 0,
               route_id: getRandomElement(routeRows).route_id,
               customer_id: getRandomElement(customerRows).customer_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               review_rating: 4,
               review_date: new Date(),
               review_comment: "Very good experience, but the bus was a bit late.",
               is_locked: 0,
               route_id: getRandomElement(routeRows).route_id,
               customer_id: getRandomElement(customerRows).customer_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               review_rating: 3,
               review_date: new Date(),
               review_comment: "Average service, could be improved.",
               is_locked: 0,
               route_id: getRandomElement(routeRows).route_id,
               customer_id: getRandomElement(customerRows).customer_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               review_rating: 5,
               review_date: new Date(),
               review_comment: "Loved the journey, very comfortable seats.",
               is_locked: 0,
               route_id: getRandomElement(routeRows).route_id,
               customer_id: getRandomElement(customerRows).customer_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               review_rating: 2,
               review_date: new Date(),
               review_comment: "Not satisfied with the cleanliness.",
               is_locked: 0,
               route_id: getRandomElement(routeRows).route_id,
               customer_id: getRandomElement(customerRows).customer_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               review_rating: 4,
               review_date: new Date(),
               review_comment: "Good service, but the driver was a bit rude.",
               is_locked: 0,
               route_id: getRandomElement(routeRows).route_id,
               customer_id: getRandomElement(customerRows).customer_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               review_rating: 5,
               review_date: new Date(),
               review_comment: "Fantastic experience, highly recommend!",
               is_locked: 0,
               route_id: getRandomElement(routeRows).route_id,
               customer_id: getRandomElement(customerRows).customer_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               review_rating: 3,
               review_date: new Date(),
               review_comment: "It was okay, nothing special.",
               is_locked: 0,
               route_id: getRandomElement(routeRows).route_id,
               customer_id: getRandomElement(customerRows).customer_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               review_rating: 4,
               review_date: new Date(),
               review_comment: "Good value for money.",
               is_locked: 0,
               route_id: getRandomElement(routeRows).route_id,
               customer_id: getRandomElement(customerRows).customer_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               review_rating: 1,
               review_date: new Date(),
               review_comment: "Terrible experience, will not use again.",
               is_locked: 0,
               route_id: getRandomElement(routeRows).route_id,
               customer_id: getRandomElement(customerRows).customer_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
         ],
         {}
      );
   },

   down: async (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete("reviews", null, {});
   },
};
