"use strict";
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
   class EmployeeType extends Model {
      static associate(models) {
         EmployeeType.hasMany(models.Employee, {
            foreignKey: "employee_type_id",
            as: "employeeType_to_employee",
         });
      }
   }

   EmployeeType.init(
      {
         employee_type_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
         },
         employee_type_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
         },
         employee_type_description: {
            type: DataTypes.STRING(500),
            allowNull: true,
         },
      },
      {
         sequelize,
         modelName: "EmployeeType",
         tableName: "employee_types",
         underscored: true,
         timestamps: true,
         paranoid: true,
         freezeTableName: true,
         indexes: [
            {
               unique: true,
               fields: ["employee_type_name", "employee_type_id"],
            },
         ],
         createdAt: "created_at",
         updatedAt: "updated_at",
         deletedAt: "deleted_at",
         charset: "utf8mb4",
         collate: "utf8mb4_unicode_ci",
      }
   );

   return EmployeeType;
};
