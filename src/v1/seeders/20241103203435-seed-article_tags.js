"use strict";

function getRandomElement(arr) {
   return arr[Math.floor(Math.random() * arr.length)];
}

module.exports = {
   up: async (queryInterface, Sequelize) => {
      const articles = await queryInterface.sequelize.query(`SELECT article_id FROM articles;`);
      const articleRows = articles[0];
      const tags = await queryInterface.sequelize.query(`SELECT tag_id FROM tags;`);
      const tagRows = tags[0];

      const usedArticleTagPairs = new Set();

      const insertData = Array.from({length: 10}, () => {
         let article, tag, pairKey;

         // Tìm cặp article_id và tag_id chưa tồn tại trong Set
         do {
            article = getRandomElement(articleRows);
            tag = getRandomElement(tagRows);
            pairKey = `${article.article_id}-${tag.tag_id}`;
         } while (usedArticleTagPairs.has(pairKey));

         usedArticleTagPairs.add(pairKey);

         return {
            article_id: article.article_id,
            tag_id: tag.tag_id,
            created_at: new Date(),
            updated_at: new Date(),
         };
      });

      return queryInterface.bulkInsert("article_tags", insertData, {});
   },

   down: async (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete("article_tags", null, {});
   },
};
