"use strict";
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
   class TripEmployee extends Model {
      static associate(models) {
         TripEmployee.belongsTo(models.Trip, {
            foreignKey: "trip_id",
            as: "tripEmployee_belongto_trip",
         });
         TripEmployee.belongsTo(models.Employee, {
            foreignKey: "employee_id",
            as: "tripEmployee_belongto_employee",
         });
      }
   }

   TripEmployee.init(
      {
         trip_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
               model: "Trip",
               key: "trip_id",
            },
         },
         employee_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
               model: "Employee",
               key: "employee_id",
            },
         },
      },
      {
         sequelize,
         modelName: "TripEmployee",
         tableName: "trip_employees",
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

   return TripEmployee;
};
