"use strict";

module.exports = {
   up: async (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert(
         "roles",
         [
            {
               role_name: "Admin",
               role_description: "Administrator with full access",
               role_value_url: "/admin",
               is_locked: 0,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               role_name: "Editor",
               role_description: "Can edit content",
               role_value_url: "/editor",
               is_locked: 0,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               role_name: "Viewer",
               role_description: "Can view content",
               role_value_url: "/viewer",
               is_locked: 0,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               role_name: "Contributor",
               role_description: "Can contribute content",
               role_value_url: "/contributor",
               is_locked: 0,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               role_name: "Moderator",
               role_description: "Can moderate content",
               role_value_url: "/moderator",
               is_locked: 0,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               role_name: "Guest",
               role_description: "Limited access for guests",
               role_value_url: "/guest",
               is_locked: 0,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               role_name: "Manager",
               role_description: "Manages teams and projects",
               role_value_url: "/manager",
               is_locked: 0,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               role_name: "Support",
               role_description: "Provides support to users",
               role_value_url: "/support",
               is_locked: 0,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               role_name: "Developer",
               role_description: "Develops and maintains software",
               role_value_url: "/developer",
               is_locked: 0,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               role_name: "Analyst",
               role_description: "Analyzes data and reports",
               role_value_url: "/analyst",
               is_locked: 0,
               created_at: new Date(),
               updated_at: new Date(),
            },
         ],
         {}
      );
   },

   down: async (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete("roles", null, {});
   },
};
