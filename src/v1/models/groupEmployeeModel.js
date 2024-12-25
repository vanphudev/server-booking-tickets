"use strict";
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
   class GroupEmployee extends Model {
      static associate(models) {
         GroupEmployee.belongsTo(models.Group, {
            foreignKey: "group_id",
            as: "groupEmployee_belongTo_group",
         });
         GroupEmployee.belongsTo(models.Employee, {
            foreignKey: "employee_id",
            as: "groupEmployee_belongTo_employee",
         });
      }
   }

   GroupEmployee.init(
      {
         group_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
               model: "Group",
               key: "group_id",
            },
         },
         employee_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
               model: "Employee",
               key: "employee_id",
            },
         },
      },
      {
         sequelize,
         modelName: "GroupEmployee",
         tableName: "group_employees",
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

   return GroupEmployee;
};
