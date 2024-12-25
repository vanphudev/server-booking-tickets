"use strict";

module.exports = {
   up: async (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert(
         "article_types",
         [
            {
               article_title: "Technology",
               article_field: "Tech News",
               is_highlight: 1,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               article_title: "Health",
               article_field: "Health Tips",
               is_highlight: 0,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               article_title: "Finance",
               article_field: "Financial Advice",
               is_highlight: 1,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               article_title: "Travel",
               article_field: "Travel Guides",
               is_highlight: 0,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               article_title: "Education",
               article_field: "Educational Resources",
               is_highlight: 1,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               article_title: "Lifestyle",
               article_field: "Lifestyle Tips",
               is_highlight: 0,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               article_title: "Sports",
               article_field: "Sports News",
               is_highlight: 1,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               article_title: "Entertainment",
               article_field: "Entertainment News",
               is_highlight: 0,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               article_title: "Science",
               article_field: "Scientific Discoveries",
               is_highlight: 1,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               article_title: "Politics",
               article_field: "Political Analysis",
               is_highlight: 0,
               created_at: new Date(),
               updated_at: new Date(),
            },
         ],
         {}
      );
   },

   down: async (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete("article_types", null, {});
   },
};
