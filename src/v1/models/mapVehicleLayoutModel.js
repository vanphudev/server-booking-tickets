"use strict";
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
   class MapVehicleLayout extends Model {
      static associate(models) {
         MapVehicleLayout.hasMany(models.Vehicle, {
            foreignKey: "map_vehicle_layout_id",
            as: "mapVehicleLayout_to_vehicle",
         });
         MapVehicleLayout.hasMany(models.MapVehicleSeat, {
            foreignKey: "map_vehicle_layout_id",
            as: "mapVehicleLayout_to_mapVehicleSeat",
         });
         MapVehicleLayout.belongsTo(models.VehicleType, {
            foreignKey: "vehicle_type_id",
            as: "mapVehicleLayout_belongto_vehicleType",
         });
      }
   }

   MapVehicleLayout.init(
      {
         map_vehicle_layout_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
         },
         layout_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
         },
         vehicle_type_id: {
            type: DataTypes.INTEGER,
            references: {
               model: "VehicleType",
               key: "vehicle_type_id",
            },
         },
      },
      {
         sequelize,
         modelName: "MapVehicleLayout",
         tableName: "map_vehicle_layouts",
         underscored: true,
         timestamps: true,
         paranoid: true,
         freezeTableName: true,
         indexes: [
            {
               unique: true,
               fields: ["map_vehicle_layout_id", "layout_name"],
            },
         ],
         createdAt: "created_at",
         updatedAt: "updated_at",
         deletedAt: "deleted_at",
         charset: "utf8mb4",
         collate: "utf8mb4_unicode_ci",
      }
   );

   return MapVehicleLayout;
};
