"use strict";
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
   class MapVehicleSeat extends Model {
      static associate(models) {
         MapVehicleSeat.belongsTo(models.MapVehicleLayout, {
            foreignKey: "map_vehicle_layout_id",
            as: "mapVehicleSeat_belongto_mapVehicleLayout",
         });
      }
   }

   MapVehicleSeat.init(
      {
         map_vehicle_seat_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
         },
         map_vehicle_seat_code: {
            type: DataTypes.STRING(255),
            allowNull: false,
         },
         map_vehicle_seat_row_no: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
               min: 1,
            },
         },
         map_vehicle_seat_column_no: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
               min: 1,
            },
         },
         map_vehicle_seat_floor_no: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
               min: 0,
            },
         },
         map_vehicle_seat_lock_chair: {
            type: DataTypes.TINYINT,
            defaultValue: 0,
            validate: {
               isIn: [[0, 1]],
            },
         },
         map_vehicle_layout_id: {
            type: DataTypes.INTEGER,
            references: {
               model: "MapVehicleLayout",
               key: "map_vehicle_layout_id",
            },
         },
      },
      {
         sequelize,
         modelName: "MapVehicleSeat",
         tableName: "map_vehicle_seats",
         underscored: true,
         timestamps: true,
         paranoid: true,
         freezeTableName: true,
         indexes: [
            {
               unique: true,
               fields: ["map_vehicle_seat_id", "map_vehicle_seat_code"],
            },
         ],
         createdAt: "created_at",
         updatedAt: "updated_at",
         deletedAt: "deleted_at",
         charset: "utf8mb4",
         collate: "utf8mb4_unicode_ci",
      }
   );

   return MapVehicleSeat;
};
