"use strict";
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
   class BookingSeat extends Model {
      static associate(models) {
         BookingSeat.belongsTo(models.Trip, {
            foreignKey: "trip_id",
            as: "bookingSeat_belongto_trip",
         });
         BookingSeat.hasMany(models.Ticket, {
            foreignKey: "booking_seat_id",
            as: "bookingSeat_to_ticket",
         });
         BookingSeat.belongsTo(models.MapVehicleSeat, {
            foreignKey: "map_vehicle_seat_id",
            as: "bookingSeat_belongto_mapVehicleSeat",
         });
      }
   }

   BookingSeat.init(
      {
         booking_seat_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
         },
         trip_id: {
            type: DataTypes.INTEGER,
            references: {
               model: "Trip",
               key: "trip_id",
            },
         },
         seat_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
         },
         booking_seat_status: {
            type: DataTypes.TINYINT,
            defaultValue: 0,
            validate: {
               isIn: [[0, 1]],
            },
         },
         booking_expiration_time: {
            type: DataTypes.DATE(6),
            defaultValue: DataTypes.NOW,
         },
         is_locked: {
            type: DataTypes.TINYINT,
            defaultValue: 0,
            validate: {
               isIn: [[0, 1]],
            },
         },
         map_vehicle_seat_id: {
            type: DataTypes.INTEGER,
            references: {
               model: "MapVehicleSeat",
               key: "map_vehicle_seat_id",
            },
         },
      },
      {
         sequelize,
         modelName: "BookingSeat",
         tableName: "booking_seats",
         underscored: true,
         timestamps: true,
         paranoid: true,
         freezeTableName: true,
         indexes: [
            {
               unique: true,
               fields: ["booking_seat_id"],
            },
         ],
         createdAt: "created_at",
         updatedAt: "updated_at",
         deletedAt: "deleted_at",
         charset: "utf8mb4",
         collate: "utf8mb4_unicode_ci",
      }
   );

   return BookingSeat;
};
