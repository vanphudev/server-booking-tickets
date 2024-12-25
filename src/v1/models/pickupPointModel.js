"use strict";
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
   class PickupPoint extends Model {
      static associate(models) {
         PickupPoint.belongsTo(models.Office, {
            foreignKey: "pickup_point_office_id",
            as: "pickupPoint_belongto_office",
         });
         PickupPoint.belongsTo(models.Way, {
            foreignKey: "pickup_point_way_id",
            as: "pickupPoint_belongto_way",
         });
      }
   }

   PickupPoint.init(
      {
         pickup_point_way_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
               model: "Way",
               key: "way_id",
            },
         },
         pickup_point_office_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
               model: "Office",
               key: "office_id",
            },
         },
         pickup_point_name: {
            type: DataTypes.STRING(500),
            allowNull: false,
         },
         pickup_point_time: {
            type: DataTypes.BIGINT,
            allowNull: true,
            validate: {
               min: 0,
            },
         },
         pickup_point_kind: {
            type: DataTypes.TINYINT(1),
            allowNull: true,
            validate: {
               isIn: [[0, 1]],
            },
         },
         pickup_point_description: {
            type: DataTypes.STRING(500),
            allowNull: true,
         },
         point_kind_name: {
            type: DataTypes.STRING(500),
            allowNull: true,
         },
      },
      {
         sequelize,
         modelName: "PickupPoint",
         tableName: "pickup_points",
         underscored: true,
         timestamps: true,
         paranoid: false,
         freezeTableName: true,
         createdAt: "created_at",
         updatedAt: "updated_at",
         deletedAt: "deleted_at",
         charset: "utf8mb4",
         collate: "utf8mb4_unicode_ci",
      }
   );

   return PickupPoint;
};
