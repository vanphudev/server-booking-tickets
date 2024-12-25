"use strict";

module.exports = {
   up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable(
         "booking_tickets",
         {
            booking_id: {
               type: Sequelize.INTEGER,
               autoIncrement: true,
               primaryKey: true,
            },
            booking_code: {
               type: Sequelize.STRING(500),
               allowNull: false,
               unique: true,
            },
            booking_status: {
               type: Sequelize.STRING(255),
               allowNull: false,
               defaultValue: "pending",
               validate: {
                  isIn: [["pending", "confirmed", "cancelled"]],
               },
            },
            booking_channel: {
               type: Sequelize.STRING(255),
               allowNull: false,
               defaultValue: "website",
               validate: {
                  isIn: [["mobile", "website", "offline"]],
               },
            },
            booking_number_of_ticket: {
               type: Sequelize.INTEGER,
               allowNull: false,
               validate: {
                  min: 1,
               },
            },
            booking_total_price: {
               type: Sequelize.DECIMAL(10, 2),
               allowNull: false,
               defaultValue: 0.0,
               validate: {
                  min: 0,
               },
            },
            discount_amount: {
               type: Sequelize.DECIMAL(10, 2),
               allowNull: false,
               defaultValue: 0.0,
               validate: {
                  min: 0,
               },
            },
            booking_total_payment: {
               type: Sequelize.DECIMAL(10, 2),
               allowNull: false,
               defaultValue: 0.0,
               validate: {
                  min: 0,
               },
            },
            booking_note: {
               type: Sequelize.TEXT("long"),
            },
            booking_session: {
               type: Sequelize.STRING(500),
               allowNull: false,
               unique: true,
            },
            customer_id: {
               type: Sequelize.INTEGER,
               allowNull: true,
               references: {
                  model: {
                     tableName: "customers",
                  },
                  key: "customer_id",
               },
            },
            office_pickup_id: {
               type: Sequelize.INTEGER,
               references: {
                  model: {
                     tableName: "offices",
                  },
                  key: "office_id",
               },
            },
            office_dropoff_id: {
               type: Sequelize.INTEGER,
               references: {
                  model: {
                     tableName: "offices",
                  },
                  key: "office_id",
               },
            },
            transfer_point_name: {
               type: Sequelize.TEXT("long"),
            },
            return_point_name: {
               type: Sequelize.TEXT("long"),
            },
            booking_expiration_time: {
               type: Sequelize.DATE,
               allowNull: false,
            },
            guest_fullname: {
               type: Sequelize.STRING(255),
               allowNull: true,
            },
            guest_phone: {
               type: Sequelize.STRING(255),
               allowNull: true,
            },
            guest_email: {
               type: Sequelize.STRING(255),
               allowNull: true,
               validate: {
                  isEmail: true,
               },
            },
            payment_method_id: {
               type: Sequelize.INTEGER,
               references: {
                  model: {
                     tableName: "payment_methods",
                  },
                  key: "payment_method_id",
               },
            },
            payment_time: {
               type: Sequelize.DATE,
               defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            payment_status: {
               type: Sequelize.STRING(255),
               defaultValue: "pending",
               validate: {
                  isIn: [["pending", "completed", "failed"]],
               },
            },
            payment_reference_code: {
               type: Sequelize.TEXT("long"),
            },
            payment_user_code: {
               type: Sequelize.TEXT("long"),
            },
            payment_amount: {
               type: Sequelize.DECIMAL(10, 2),
               allowNull: false,
               defaultValue: 0.0,
               validate: {
                  min: 0,
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
            voucher_id: {
               type: Sequelize.INTEGER,
               references: {
                  model: {
                     tableName: "vouchers",
                  },
                  key: "voucher_id",
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
      await queryInterface.dropTable("booking_tickets");
   },
};
