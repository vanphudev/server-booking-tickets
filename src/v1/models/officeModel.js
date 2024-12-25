"use strict";
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
   class Office extends Model {
      static associate(models) {
         Office.belongsTo(models.Ward, {
            foreignKey: "ward_id",
            as: "office_belongto_ward",
         });
         Office.hasMany(models.PickupPoint, {
            foreignKey: "pickup_point_office_id",
            as: "office_to_pickupPoint",
         });
         Office.belongsToMany(models.Way, {
            through: models.PickupPoint,
            foreignKey: "pickup_point_office_id",
            otherKey: "pickup_point_way_id",
            as: "office_to_way",
         });
         Office.hasMany(models.Employee, {
            foreignKey: "office_id",
            as: "office_to_employee",
         });
         Office.hasMany(models.OfficeImage, {
            foreignKey: "office_id",
            as: "office_to_officeImage",
         });
         Office.hasMany(models.Refund, {
            foreignKey: "office_id",
            as: "office_to_refund",
         });
         Office.hasMany(models.Route, {
            foreignKey: "office_id",
            as: "office_to_routeOrigin",
         });
         Office.hasMany(models.Route, {
            foreignKey: "office_id",
            as: "office_to_routeDestination",
         });
         Office.hasMany(models.Vehicle, {
            foreignKey: "office_id",
            as: "office_to_vehicle",
         });
         Office.hasMany(models.BookingTicket, {
            foreignKey: "office_id",
            as: "office_to_Dropoff",
         });
         Office.hasMany(models.BookingTicket, {
            foreignKey: "office_id",
            as: "office_to_Pickup",
         });
      }
   }
   Office.init(
      {
         office_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
         },
         office_name: {
            type: DataTypes.STRING(500),
            allowNull: false,
            unique: true,
         },
         office_address: {
            type: DataTypes.TEXT("long"),
         },
         office_phone: {
            type: DataTypes.STRING(20),
            allowNull: false,
            validate: {
               isNumeric: true,
            },
            unique: true,
         },
         office_fax: {
            type: DataTypes.STRING(20),
         },
         office_description: {
            type: DataTypes.TEXT("long"),
         },
         office_latitude: {
            type: DataTypes.TEXT("long"),
         },
         office_longitude: {
            type: DataTypes.TEXT("long"),
         },
         office_map_url: {
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
         ward_id: {
            type: DataTypes.STRING(50),
            references: {
               model: "Ward",
               key: "ward_id",
            },
         },
      },
      {
         sequelize,
         modelName: "Office",
         tableName: "offices",
         underscored: true,
         timestamps: true,
         paranoid: true,
         freezeTableName: true,
         indexes: [
            {
               unique: true,
               fields: ["office_name", "office_name"],
            },
         ],
         createdAt: "created_at",
         updatedAt: "updated_at",
         deletedAt: "deleted_at",
         charset: "utf8mb4",
         collate: "utf8mb4_unicode_ci",
      }
   );
   return Office;
};
