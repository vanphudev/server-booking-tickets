"use strict";

module.exports = {
   up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable(
         "employees",
         {
            employee_id: {
               type: Sequelize.INTEGER,
               autoIncrement: true,
               primaryKey: true,
            },
            employee_full_name: {
               type: Sequelize.STRING(500),
               allowNull: false,
            },
            employee_email: {
               type: Sequelize.STRING(500),
               allowNull: false,
               unique: true,
            },
            employee_phone: {
               type: Sequelize.STRING(20),
               allowNull: false,
               unique: true,
            },
            employee_username: {
               type: Sequelize.STRING(255),
               allowNull: false,
               unique: true,
            },
            employee_birthday: {
               type: Sequelize.DATEONLY,
               validate: {
                  isBetween() {
                     if (
                        new Date(this.employee_birthday) < new Date("1900-01-01") ||
                        new Date(this.employee_birthday) > new Date("2100-12-31")
                     ) {
                        throw new Error("Birthday must be between 1900-01-01 and 2100-12-31");
                     }
                  },
               },
            },
            employee_password: {
               type: Sequelize.TEXT("long"),
               allowNull: false,
            },
            employee_profile_image: {
               type: Sequelize.TEXT("long"),
               allowNull: true,
               validate: {
                  isBase64: true,
               },
            },
            employee_gender: {
               type: Sequelize.TINYINT(1),
               allowNull: true,
               validate: {
                  isIn: [[0, 1, -1]],
               },
            },
            is_first_activation: {
               type: Sequelize.TINYINT(1),
               defaultValue: 1,
               validate: {
                  isIn: [[0, 1]],
               },
            },
            is_locked: {
               type: Sequelize.TINYINT(1),
               defaultValue: 0,
               validate: {
                  isIn: [[0, 1]],
               },
            },
            last_lock_at: {
               type: Sequelize.DATE,
               allowNull: true,
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
            office_id: {
               type: Sequelize.INTEGER,
               allowNull: true,
               references: {
                  model: {
                     tableName: "offices",
                  },
                  key: "office_id",
               },
            },
            employee_type_id: {
               type: Sequelize.INTEGER,
               allowNull: true,
               references: {
                  model: {
                     tableName: "employee_types",
                  },
                  key: "employee_type_id",
               },
            },
         },
         {
            charset: "utf8mb4",
            collate: "utf8mb4_unicode_ci",
         }
      );
   },

   down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable("employees");
   },
};
