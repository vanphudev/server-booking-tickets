"use strict";

module.exports = {
   up: async (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert(
         "`groups`",
         [
            {
               group_name: "Admin Group",
               group_description: "Group for system administrators",
               is_locked: 0,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               group_name: "Editors Group",
               group_description: "Group for content editors",
               is_locked: 0,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               group_name: "Viewers Group",
               group_description: "Group for content viewers",
               is_locked: 0,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               group_name: "Contributors Group",
               group_description: "Group for content contributors",
               is_locked: 0,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               group_name: "Moderators Group",
               group_description: "Group for content moderators",
               is_locked: 0,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               group_name: "Guests Group",
               group_description: "Group for guest users",
               is_locked: 0,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               group_name: "Managers Group",
               group_description: "Group for managers",
               is_locked: 0,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               group_name: "Support Group",
               group_description: "Group for support staff",
               is_locked: 0,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               group_name: "Developers Group",
               group_description: "Group for developers",
               is_locked: 0,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               group_name: "Analysts Group",
               group_description: "Group for data analysts",
               is_locked: 0,
               created_at: new Date(),
               updated_at: new Date(),
            },
         ],
         {}
      );
   },

   down: async (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete("groups", null, {});
   },
};
