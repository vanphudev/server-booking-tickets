"use strict";
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
   class Review extends Model {
      static associate(models) {
         Review.belongsTo(models.Route, {
            foreignKey: "route_id",
            as: "review_belongto_route",
         });
         Review.belongsTo(models.Customer, {
            foreignKey: "customer_id",
            as: "review_belongto_customer",
         });
         Review.belongsTo(models.Trip, {
            foreignKey: "trip_id",
            as: "review_belongto_trip",
         });
         Review.belongsTo(models.BookingTicket, {
            foreignKey: "booking_id",
            as: "review_belongto_bookingTicket",
         });
      }
   }

   Review.init(
      {
         review_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
         },
         review_rating: {
            type: DataTypes.INTEGER,
            defaultValue: 5,
            allowNull: false,
            validate: {
               min: 1,
               max: 5,
            },
         },
         review_date: {
            type: DataTypes.DATE(6),
            defaultValue: DataTypes.NOW,
         },
         review_comment: {
            type: DataTypes.TEXT("long"),
         },
         is_locked: {
            type: DataTypes.TINYINT,
            defaultValue: 0,
            validate: {
               isIn: [[0, 1]],
            },
         },
         last_lock_at: {
            type: DataTypes.DATE(6),
            allowNull: true,
         },
         route_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
               model: "Route",
               key: "route_id",
            },
         },
         customer_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
               model: "Customer",
               key: "customer_id",
            },
         },
         trip_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
               model: "Trip",
               key: "trip_id",
            },
         },
         booking_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
               model: "BookingTicket",
               key: "booking_id",
            },
            unique: true,
         },
      },
      {
         sequelize,
         modelName: "Review",
         tableName: "reviews",
         underscored: true,
         timestamps: true,
         paranoid: true,
         freezeTableName: true,
         indexes: [
            {
               unique: true,
               fields: ["review_id", "booking_id", "trip_id", "route_id", "customer_id"],
            },
         ],
         createdAt: "created_at",
         updatedAt: "updated_at",
         deletedAt: "deleted_at",
         charset: "utf8mb4",
         collate: "utf8mb4_unicode_ci",
      }
   );

   return Review;
};
