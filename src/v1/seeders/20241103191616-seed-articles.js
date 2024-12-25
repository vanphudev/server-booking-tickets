"use strict";

function getRandomElement(arr) {
   return arr[Math.floor(Math.random() * (arr.length - 1))];
}

module.exports = {
   up: async (queryInterface, Sequelize) => {
      const employees = await queryInterface.sequelize.query(`SELECT employee_id FROM employees;`);
      const employeeRows = employees[0];
      const articleTypes = await queryInterface.sequelize.query(`SELECT article_type_id FROM article_types;`);
      const articleTypeRows = articleTypes[0];
      return queryInterface.bulkInsert(
         "articles",
         [
            {
               article_title: "The Future of Technology",
               article_description: "Exploring the advancements in technology.",
               article_content: "Content about the future of technology...",
               article_slug: "the-future-of-technology",
               published_at: new Date(),
               is_priority: 1,
               article_type_id: getRandomElement(articleTypeRows).article_type_id,
               employee_id: getRandomElement(employeeRows).employee_id,
               thumbnail_img: "http://example.com/tech-thumbnail.jpg",
               thumbnail_img_public_id: "tech-thumbnail",
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               article_title: "Health Tips for 2023",
               article_description: "Stay healthy with these tips.",
               article_content: "Content about health tips...",
               article_slug: "health-tips-2023",
               published_at: new Date(),
               is_priority: 0,
               article_type_id: getRandomElement(articleTypeRows).article_type_id,
               employee_id: getRandomElement(employeeRows).employee_id,
               thumbnail_img: "http://example.com/health-thumbnail.jpg",
               thumbnail_img_public_id: "health-thumbnail",
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               article_title: "Financial Advice for Young Adults",
               article_description: "How to manage your finances effectively.",
               article_content: "Content about financial advice...",
               article_slug: "financial-advice-young-adults",
               published_at: new Date(),
               is_priority: 1,
               article_type_id: getRandomElement(articleTypeRows).article_type_id,
               employee_id: getRandomElement(employeeRows).employee_id,
               thumbnail_img: "http://example.com/finance-thumbnail.jpg",
               thumbnail_img_public_id: "finance-thumbnail",
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               article_title: "Top Travel Destinations",
               article_description: "Discover the best places to visit.",
               article_content: "Content about travel destinations...",
               article_slug: "top-travel-destinations",
               published_at: new Date(),
               is_priority: 0,
               article_type_id: getRandomElement(articleTypeRows).article_type_id,
               employee_id: getRandomElement(employeeRows).employee_id,
               thumbnail_img: "http://example.com/travel-thumbnail.jpg",
               thumbnail_img_public_id: "travel-thumbnail",
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               article_title: "Educational Resources for Students",
               article_description: "Resources to help students succeed.",
               article_content: "Content about educational resources...",
               article_slug: "educational-resources-students",
               published_at: new Date(),
               is_priority: 1,
               article_type_id: getRandomElement(articleTypeRows).article_type_id,
               employee_id: getRandomElement(employeeRows).employee_id,
               thumbnail_img: "http://example.com/education-thumbnail.jpg",
               thumbnail_img_public_id: "education-thumbnail",
               created_at: new Date(),
               updated_at: new Date(),
            },
         ],
         {}
      );
   },

   down: async (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete("articles", null, {});
   },
};
