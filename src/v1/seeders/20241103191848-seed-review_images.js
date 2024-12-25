"use strict";

function getRandomElement(arr) {
   return arr[Math.floor(Math.random() * (arr.length - 1))];
}

module.exports = {
   up: async (queryInterface, Sequelize) => {
      const reviews = await queryInterface.sequelize.query(`SELECT review_id FROM reviews;`);
      const reviewRows = reviews[0];
      return queryInterface.bulkInsert(
         "review_images",
         [
            {
               review_id: getRandomElement(reviewRows).review_id,
               review_image_url: "http://example.com/review1-image1.jpg",
               review_image_public_id: "review1-image1",
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               review_id: getRandomElement(reviewRows).review_id,
               review_image_url: "http://example.com/review1-image2.jpg",
               review_image_public_id: "review1-image2",
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               review_id: getRandomElement(reviewRows).review_id,
               review_image_url: "http://example.com/review2-image1.jpg",
               review_image_public_id: "review2-image1",
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               review_id: getRandomElement(reviewRows).review_id,
               review_image_url: "http://example.com/review2-image2.jpg",
               review_image_public_id: "review2-image2",
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               review_id: getRandomElement(reviewRows).review_id,
               review_image_url: "http://example.com/review3-image1.jpg",
               review_image_public_id: "review3-image1",
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               review_id: getRandomElement(reviewRows).review_id,
               review_image_url: "http://example.com/review3-image2.jpg",
               review_image_public_id: "review3-image2",
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               review_id: getRandomElement(reviewRows).review_id,
               review_image_url: "http://example.com/review4-image1.jpg",
               review_image_public_id: "review4-image1",
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               review_id: getRandomElement(reviewRows).review_id,
               review_image_url: "http://example.com/review4-image2.jpg",
               review_image_public_id: "review4-image2",
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               review_id: getRandomElement(reviewRows).review_id,
               review_image_url: "http://example.com/review5-image1.jpg",
               review_image_public_id: "review5-image1",
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               review_id: getRandomElement(reviewRows).review_id,
               review_image_url: "http://example.com/review5-image2.jpg",
               review_image_public_id: "review5-image2",
               created_at: new Date(),
               updated_at: new Date(),
            },
         ],
         {}
      );
   },

   down: async (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete("review_images", null, {});
   },
};
