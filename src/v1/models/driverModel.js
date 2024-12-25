"use strict";
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
   class Driver extends Model {
      static associate(models) {
         Driver.belongsTo(models.Employee, {
            foreignKey: "employee_id",
            as: "driver_onetoOne_employee",
         });
      }
   }

   Driver.init(
      {
         driver_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
         },
         driver_license_number: {
            type: DataTypes.STRING(500),
            allowNull: false,
         },
         driver_experience_years: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
               min: 0,
            },
         },
         employee_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            references: {
               model: "Employee",
               key: "employee_id",
            },
         },
      },
      {
         sequelize,
         modelName: "Driver",
         tableName: "drivers",
         underscored: true,
         timestamps: true,
         paranoid: true,
         freezeTableName: true,
         indexes: [
            {
               unique: true,
               fields: ["driver_id"],
            },
         ],
         createdAt: "created_at",
         updatedAt: "updated_at",
         deletedAt: "deleted_at",
         charset: "utf8mb4",
         collate: "utf8mb4_unicode_ci",
      }
   );

   return Driver;
};
