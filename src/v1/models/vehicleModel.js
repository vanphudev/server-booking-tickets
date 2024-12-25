"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
   class Vehicle extends Model {
      static associate(models) {
         Vehicle.belongsTo(models.Office, { foreignKey: "office_id", as: "vehicle_belongto_office" });
         Vehicle.belongsTo(models.MapVehicleLayout, {
            foreignKey: "map_vehicle_layout_id",
            as: "vehicle_belongto_mapVehicleLayout",
         });
         Vehicle.hasMany(models.Trip, {
            foreignKey: "vehicle_id",
            as: "vehicle_to_trip",
         });
      }
   }

   Vehicle.init(
      {
         vehicle_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
         },
         vehicle_code: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
         },
         vehicle_license_plate: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
         },
         vehicle_model: {
            type: DataTypes.STRING(255),
         },
         vehicle_brand: {
            type: DataTypes.STRING(255),
         },
         vehicle_capacity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
               min: 1,
            },
         },
         vehicle_manufacture_year: {
            type: DataTypes.INTEGER,
            validate: {
               min: 1800,
            },
         },
         vehicle_color: {
            type: DataTypes.STRING(255),
         },
         vehicle_image: {
            type: DataTypes.TEXT("long"),
            allowNull: true,
         },
         vehicle_description: {
            type: DataTypes.STRING(500),
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
         map_vehicle_layout_id: {
            type: DataTypes.INTEGER,
            references: {
               model: "MapVehicleLayout",
               key: "map_vehicle_layout_id",
            },
         },
         office_id: {
            type: DataTypes.INTEGER,
            references: {
               model: "Office",
               key: "office_id",
            },
         },
      },
      {
         sequelize,
         modelName: "Vehicle",
         tableName: "vehicles",
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

   return Vehicle;
};
