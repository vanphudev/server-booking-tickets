"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
   class Way extends Model {
      static associate(models) {
         Way.hasMany(models.Route, {
            foreignKey: "way_id",
            as: "way_to_route",
         });
         Way.belongsToMany(models.Office, {
            through: models.PickupPoint,
            foreignKey: "pickup_point_way_id",
            otherKey: "pickup_point_office_id",
            as: "way_to_office",
         });
         Way.hasMany(models.PickupPoint, {
            foreignKey: "pickup_point_way_id",
            sourceKey: "way_id",
            as: "way_to_pickupPoint",
         });
      }
   }

   Way.init(
      {
         way_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
         },
         way_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
         },
         way_description: {
            type: DataTypes.STRING(500),
            allowNull: true,
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
      },
      {
         sequelize,
         modelName: "Way",
         tableName: "ways",
         underscored: true,
         timestamps: true,
         paranoid: true,
         freezeTableName: true,
         indexes: [
            {
               unique: true,
               fields: ["way_id", "way_name"],
            },
         ],
         createdAt: "created_at",
         updatedAt: "updated_at",
         deletedAt: "deleted_at",
         charset: "utf8mb4",
         collate: "utf8mb4_unicode_ci",
      }
   );

   return Way;
};
