"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
   class VehicleType extends Model {
      static associate(models) {
         VehicleType.hasMany(models.MapVehicleLayout, {
            foreignKey: "vehicle_type_id",
            as: "vehicleType_to_mapVehicleLayout",
         });
      }
   }

   VehicleType.init(
      {
         vehicle_type_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
         },
         vehicle_type_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
         },
         vehicle_type_description: {
            type: DataTypes.STRING(500),
         },
      },
      {
         sequelize,
         modelName: "VehicleType",
         tableName: "vehicle_types",
         underscored: true,
         timestamps: true,
         paranoid: true,
         freezeTableName: true,
         indexes: [
            {
               unique: true,
               fields: ["vehicle_type_name", "vehicle_type_id"],
            },
         ],
         createdAt: "created_at",
         updatedAt: "updated_at",
         deletedAt: "deleted_at",
         charset: "utf8mb4",
         collate: "utf8mb4_unicode_ci",
      }
   );

   return VehicleType;
};
