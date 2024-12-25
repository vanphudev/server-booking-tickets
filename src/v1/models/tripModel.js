"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
   class Trip extends Model {
      static associate(models) {
         Trip.belongsTo(models.Route, {
            foreignKey: "route_id",
            as: "trip_belongto_route",
         });
         Trip.belongsTo(models.Vehicle, {
            foreignKey: "vehicle_id",
            as: "trip_belongto_vehicle",
         });
         Trip.hasMany(models.BookingSeat, {
            foreignKey: "trip_id",
            as: "trip_to_bookingSeat",
         });
         Trip.belongsToMany(models.Employee, {
            through: models.TripEmployee,
            foreignKey: "trip_id",
            otherKey: "employee_id",
            as: "trip_to_employee",
         });
         Trip.hasMany(models.TripEmployee, {
            foreignKey: "trip_id",
            as: "trip_to_tripEmployee",
         });
      }
   }
   Trip.init(
      {
         trip_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
         },
         trip_arrival_time: {
            type: DataTypes.DATE(6),
            allowNull: false,
            defaultValue: DataTypes.NOW,
         },
         trip_departure_time: {
            type: DataTypes.DATE(6),
            allowNull: false,
            defaultValue: DataTypes.NOW,
         },
         trip_date: {
            type: DataTypes.DATE(6),
            defaultValue: DataTypes.NOW,
         },
         trip_price: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0.0,
            validate: {
               min: 0,
            },
         },
         trip_discount: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0.0,
            validate: {
               min: 0,
               isLessThanOrEqualToPrice(value) {
                  if (value > this.trip_price) {
                     throw new Error("Discount cannot exceed the price");
                  }
               },
            },
         },
         trip_shuttle_enable: {
            type: DataTypes.TINYINT(1),
            defaultValue: 0,
            validate: {
               isIn: [[0, 1]],
            },
         },
         allow_online_booking: {
            type: DataTypes.TINYINT(1),
            defaultValue: 0,
            validate: {
               isIn: [[0, 1]],
            },
         },
         trip_holiday: {
            type: DataTypes.TINYINT(1),
            defaultValue: 0,
            validate: {
               isIn: [[0, 1]],
            },
         },
         route_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
               model: "Route",
               key: "route_id",
            },
         },
         vehicle_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
               model: "Vehicle",
               key: "vehicle_id",
            },
         },
      },
      {
         sequelize,
         modelName: "Trip",
         tableName: "trips",
         underscored: true,
         timestamps: true,
         paranoid: true,
         freezeTableName: true,
         indexes: [
            {
               unique: true,
               fields: ["trip_id"],
            },
         ],
         createdAt: "created_at",
         updatedAt: "updated_at",
         deletedAt: "deleted_at",
         charset: "utf8mb4",
         collate: "utf8mb4_unicode_ci",
      }
   );

   return Trip;
};
