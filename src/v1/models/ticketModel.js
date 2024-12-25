"use strict";
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
   class Ticket extends Model {
      static associate(models) {
         Ticket.belongsTo(models.BookingSeat, {
            foreignKey: "booking_seat_id",
            as: "ticket_belongto_bookingSeat",
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
         });
         Ticket.belongsToMany(models.BookingTicket, {
            through: models.BookingTicketDetail,
            foreignKey: "ticket_id",
            otherKey: "booking_id",
            as: "ticket_to_bookingTicket",
         });
         Ticket.hasMany(models.BookingTicketDetail, {
            foreignKey: "ticket_id",
            as: "ticket_to_bookingTicketDetail",
         });
         Ticket.hasMany(models.Refund, {
            foreignKey: "ticket_id",
            as: "ticket_to_refund",
         });
      }
   }

   Ticket.init(
      {
         ticket_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
         },
         ticket_code: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
         },
         booking_seat_id: {
            type: DataTypes.INTEGER,
            references: {
               model: "BookingSeat",
               key: "booking_seat_id",
            },
         },
         ticket_name_chair: {
            type: DataTypes.STRING(255),
            allowNull: false,
         },
         is_export_ticket: {
            type: DataTypes.TINYINT,
            defaultValue: 0,
            validate: {
               isIn: [[0, 1]],
            },
         },
         ticket_amount: {
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
         modelName: "Ticket",
         tableName: "tickets",
         underscored: true,
         timestamps: true,
         paranoid: true,
         freezeTableName: true,
         indexes: [
            {
               unique: true,
               fields: ["ticket_id"],
            },
         ],
         createdAt: "created_at",
         updatedAt: "updated_at",
         deletedAt: "deleted_at",
         charset: "utf8mb4",
         collate: "utf8mb4_unicode_ci",
      }
   );

   return Ticket;
};
