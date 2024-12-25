"use strict";

module.exports = {
   up: async (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert(
         "tags",
         [
            {
               tag_name: "technology",
               tag_description: "Articles related to technology advancements.",
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               tag_name: "health",
               tag_description: "Articles focused on health and wellness.",
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               tag_name: "finance",
               tag_description: "Financial advice and news.",
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               tag_name: "travel",
               tag_description: "Travel guides and tips.",
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               tag_name: "education",
               tag_description: "Educational resources and news.",
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               tag_name: "lifestyle",
               tag_description: "Lifestyle tips and trends.",
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               tag_name: "sports",
               tag_description: "Latest sports news and updates.",
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               tag_name: "entertainment",
               tag_description: "Entertainment news and gossip.",
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               tag_name: "science",
               tag_description: "Scientific discoveries and research.",
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               tag_name: "politics",
               tag_description: "Political news and analysis.",
               created_at: new Date(),
               updated_at: new Date(),
            },
         ],
         {}
      );
   },

   down: async (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete("tags", null, {});
   },
};
