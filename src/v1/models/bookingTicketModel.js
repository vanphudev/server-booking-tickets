"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
   class BookingTicket extends Model {
      static associate(models) {
         BookingTicket.belongsTo(models.Customer, {
            foreignKey: "customer_id",
            as: "bookingTicket_belongto_customer",
         });
         BookingTicket.belongsTo(models.PaymentMethod, {
            foreignKey: "payment_method_id",
            as: "bookingTicket_belongto_paymentMethod",
         });
         BookingTicket.belongsToMany(models.Ticket, {
            through: models.BookingTicketDetail,
            foreignKey: "booking_id",
            otherKey: "ticket_id",
            as: "bookingTicket_to_ticket",
         });
         BookingTicket.hasMany(models.BookingTicketDetail, {
            foreignKey: "booking_id",
            as: "bookingTicket_to_bookingTicketDetail",
         });
         BookingTicket.belongsTo(models.Voucher, {
            foreignKey: "voucher_id",
            as: "bookingTicket_belongto_voucher",
         });
         BookingTicket.belongsTo(models.Office, {
            foreignKey: "office_pickup_id",
            as: "bookingTicket_belongto_officePickup",
         });
         BookingTicket.belongsTo(models.Office, {
            foreignKey: "office_dropoff_id",
            as: "bookingTicket_belongto_officeDropoff",
         });
      }
   }

   BookingTicket.init(
      {
         booking_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
         },
         booking_code: {
            type: DataTypes.STRING(500),
            allowNull: false,
            unique: true,
         },
         booking_status: {
            type: DataTypes.STRING(255),
            allowNull: false,
            defaultValue: "pending",
            validate: {
               isIn: [["pending", "confirmed", "cancelled"]],
            },
         },
         booking_channel: {
            type: DataTypes.STRING(255),
            allowNull: false,
            defaultValue: "website",
            validate: {
               isIn: [["mobile", "website", "offline"]],
            },
         },
         booking_number_of_ticket: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
               min: 1,
            },
         },
         booking_total_price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.0,
            validate: {
               min: 0,
            },
         },
         discount_amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.0,
            validate: {
               min: 0,
            },
         },
         booking_total_payment: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.0,
            validate: {
               min: 0,
            },
         },
         booking_note: {
            type: DataTypes.TEXT("long"),
         },
         booking_session: {
            type: DataTypes.TEXT("long"),
            allowNull: false,
            unique: true,
         },
         customer_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
               model: "Customer",
               key: "customer_id",
            },
         },
         office_pickup_id: {
            type: DataTypes.INTEGER,
            references: {
               model: "Office",
               key: "office_id",
            },
         },
         office_dropoff_id: {
            type: DataTypes.INTEGER,
            references: {
               model: "Office",
               key: "office_id",
            },
         },
         transfer_point_name: {
            type: DataTypes.TEXT("long"),
         },
         return_point_name: {
            type: DataTypes.TEXT("long"),
         },
         booking_expiration_time: {
            type: DataTypes.DATE(6),
         },
         guest_fullname: {
            type: DataTypes.STRING(255),
            allowNull: true,
         },
         guest_phone: {
            type: DataTypes.STRING(255),
            allowNull: true,
         },
         guest_email: {
            type: DataTypes.STRING(255),
            allowNull: true,
            validate: {
               isEmail: true,
            },
         },
         payment_method_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
               model: "PaymentMethod",
               key: "payment_method_id",
            },
         },
         voucher_id: {
            type: DataTypes.INTEGER,
            references: {
               model: "Voucher",
               key: "voucher_id",
            },
         },
         payment_time: {
            type: DataTypes.DATE(6),
            defaultValue: DataTypes.NOW,
         },
         payment_status: {
            type: DataTypes.STRING(255),
            defaultValue: "pending",
            validate: {
               isIn: [["pending", "completed", "failed"]],
            },
         },
         payment_reference_code: {
            type: DataTypes.TEXT("long"),
            unique: true,
         },
         payment_user_code: {
            type: DataTypes.TEXT("long"),
         },
         payment_amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.0,
            validate: {
               min: 0,
            },
         },
      },
      {
         sequelize,
         modelName: "BookingTicket",
         tableName: "booking_tickets",
         underscored: true,
         timestamps: true,
         paranoid: true,
         freezeTableName: true,
         indexes: [
            {
               unique: true,
               fields: ["booking_code", "booking_code"],
            },
         ],
         createdAt: "created_at",
         updatedAt: "updated_at",
         deletedAt: "deleted_at",
         charset: "utf8mb4",
         collate: "utf8mb4_unicode_ci",
         hooks: {
            beforeSave: (booking) => {
               const totalPrice = parseFloat(booking.booking_total_price || 0);
               booking.booking_total_payment = totalPrice;
               booking.payment_amount = totalPrice;
            },
         },
      }
   );

   return BookingTicket;
};
