"use strict";
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
   class Route extends Model {
      static associate(models) {
         Route.belongsTo(models.Office, {
            foreignKey: "origin_office_id",
            as: "route_belongto_originOffice",
         });
         Route.belongsTo(models.Office, {
            foreignKey: "destination_office_id",
            as: "route_belongto_destinationOffice",
         });
         Route.belongsTo(models.Way, {
            foreignKey: "way_id",
            as: "route_belongto_way",
         });
         Route.hasMany(models.Review, {
            foreignKey: "route_id",
            as: "route_to_review",
         });
         Route.hasMany(models.Trip, {
            foreignKey: "route_id",
            as: "route_to_trip",
         });
      }
   }

   Route.init(
      {
         route_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
         },
         route_name: {
            type: DataTypes.STRING(500),
            allowNull: false,
            unique: true,
         },
         route_duration: {
            type: DataTypes.BIGINT,
            allowNull: true,
            validate: {
               min: 0,
            },
         },
         route_distance: {
            type: DataTypes.BIGINT,
            allowNull: true,
            validate: {
               min: 0,
            },
         },
         route_url_gps: {
            type: DataTypes.TEXT("long"),
         },
         origin_office_id: {
            type: DataTypes.INTEGER,
            references: {
               model: "Office",
               key: "office_id",
            },
         },
         destination_office_id: {
            type: DataTypes.INTEGER,
            references: {
               model: "Office",
               key: "office_id",
            },
         },
         route_price: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0.0,
            validate: {
               min: 0,
            },
         },
         is_default: {
            type: DataTypes.TINYINT,
            defaultValue: 0,
            validate: {
               isIn: [[0, 1]],
            },
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
         },
         way_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
               model: "Way",
               key: "way_id",
            },
         },
      },
      {
         sequelize,
         modelName: "Route",
         tableName: "routes",
         underscored: true,
         timestamps: true,
         paranoid: true,
         freezeTableName: true,
         indexes: [
            {
               unique: true,
               fields: ["route_name", "route_id"],
            },
         ],
         createdAt: "created_at",
         updatedAt: "updated_at",
         deletedAt: "deleted_at",
         charset: "utf8mb4",
         collate: "utf8mb4_unicode_ci",
      }
   );

   return Route;
};
