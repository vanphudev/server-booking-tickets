"use strict";

function getRandomElement(arr) {
   return arr[Math.floor(Math.random() * (arr.length - 1))];
}

module.exports = {
   up: async (queryInterface, Sequelize) => {
      const articles = await queryInterface.sequelize.query(`SELECT article_id FROM articles;`);
      const articleRows = articles[0];

      return queryInterface.bulkInsert(
         "image_articles",
         [
            {
               image_article_name: "Tech Image 1",
               image_article_url: "http://example.com/tech-image1.jpg",
               image_article_public_id: "tech-image1",
               article_id: getRandomElement(articleRows).article_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               image_article_name: "Health Image 1",
               image_article_url: "http://example.com/health-image1.jpg",
               image_article_public_id: "health-image1",
               article_id: getRandomElement(articleRows).article_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               image_article_name: "Finance Image 1",
               image_article_url: "http://example.com/finance-image1.jpg",
               image_article_public_id: "finance-image1",
               article_id: getRandomElement(articleRows).article_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               image_article_name: "Travel Image 1",
               image_article_url: "http://example.com/travel-image1.jpg",
               image_article_public_id: "travel-image1",
               article_id: getRandomElement(articleRows).article_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               image_article_name: "Education Image 1",
               image_article_url: "http://example.com/education-image1.jpg",
               image_article_public_id: "education-image1",
               article_id: getRandomElement(articleRows).article_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               image_article_name: "Lifestyle Image 1",
               image_article_url: "http://example.com/lifestyle-image1.jpg",
               image_article_public_id: "lifestyle-image1",
               article_id: getRandomElement(articleRows).article_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               image_article_name: "Sports Image 1",
               image_article_url: "http://example.com/sports-image1.jpg",
               image_article_public_id: "sports-image1",
               article_id: getRandomElement(articleRows).article_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               image_article_name: "Entertainment Image 1",
               image_article_url: "http://example.com/entertainment-image1.jpg",
               image_article_public_id: "entertainment-image1",
               article_id: getRandomElement(articleRows).article_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               image_article_name: "Science Image 1",
               image_article_url: "http://example.com/science-image1.jpg",
               image_article_public_id: "science-image1",
               article_id: getRandomElement(articleRows).article_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               image_article_name: "Politics Image 1",
               image_article_url: "http://example.com/politics-image1.jpg",
               image_article_public_id: "politics-image1",
               article_id: getRandomElement(articleRows).article_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
         ],
         {}
      );
   },

   down: async (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete("image_articles", null, {});
   },
};
