"use strict";
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
   class BookingTicketDetail extends Model {
      static associate(models) {
         BookingTicketDetail.belongsTo(models.BookingTicket, {
            foreignKey: "booking_id",
            as: "bookingTicketDetail_belongto_bookingTicket",
         });
         BookingTicketDetail.belongsTo(models.Ticket, {
            foreignKey: "ticket_id",
            as: "bookingTicketDetail_belongto_ticket",
         });
      }
   }

   BookingTicketDetail.init(
      {
         booking_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
               model: "BookingTicket",
               key: "booking_id",
            },
         },
         ticket_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
               model: "Ticket",
               key: "ticket_id",
            },
         },
         price: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0.0,
            validate: {
               min: 0,
            },
         },
      },
      {
         sequelize,
         modelName: "BookingTicketDetail",
         tableName: "booking_ticket_details",
         underscored: true,
         timestamps: true,
         paranoid: true,
         freezeTableName: true,
         createdAt: "created_at",
         updatedAt: "updated_at",
         deletedAt: "deleted_at",
         charset: "utf8mb4",
         collate: "utf8mb4_unicode_ci",
      }
   );

   return BookingTicketDetail;
};
