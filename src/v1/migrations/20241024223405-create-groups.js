"use strict";

module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.createTable(
         "groups",
         {
            group_id: {
               type: Sequelize.INTEGER,
               autoIncrement: true,
               primaryKey: true,
            },
            group_name: {
               type: Sequelize.STRING(255),
               allowNull: false,
               unique: true,
            },
            group_description: {
               type: Sequelize.STRING(500),
            },
            is_locked: {
               type: Sequelize.TINYINT(1),
               defaultValue: 0,
               validate: {
                  isIn: [[0, 1]],
               },
            },
            created_at: {
               type: Sequelize.DATE,
               defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            updated_at: {
               type: Sequelize.DATE,
               defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
               onUpdate: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            deleted_at: {
               type: Sequelize.DATE,
               defaultValue: null,
            },
         },
         {
            charset: "utf8mb4",
            collate: "utf8mb4_unicode_ci",
         }
      );
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.dropTable("groups");
   },
};
