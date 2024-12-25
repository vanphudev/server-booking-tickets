"use strict";
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
   class Group extends Model {
      static associate(models) {
         Group.belongsToMany(models.Employee, {
            through: models.GroupEmployee,
            foreignKey: "group_id",
            otherKey: "employee_id",
            as: "group_to_employee",
         });
         Group.hasMany(models.GroupEmployee, {
            foreignKey: "group_id",
            as: "group_to_groupEmployee",
         });
         Group.belongsToMany(models.Role, {
            through: models.RoleGroup,
            foreignKey: "group_id",
            otherKey: "role_id",
            as: "group_to_role",
         });
         Group.hasMany(models.RoleGroup, {
            foreignKey: "group_id",
            as: "group_to_roleGroup",
         });
      }
   }

   Group.init(
      {
         group_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
         },
         group_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
         },
         group_description: {
            type: DataTypes.STRING(500),
         },
         is_locked: {
            type: DataTypes.TINYINT(1),
            defaultValue: 0,
            validate: {isIn: [[0, 1]]},
         },
      },
      {
         sequelize,
         modelName: "Group",
         tableName: "groups",
         underscored: true,
         timestamps: true,
         paranoid: true,
         freezeTableName: true,
         indexes: [
            {
               unique: true,
               fields: ["group_name", "group_id"],
            },
         ],
         createdAt: "created_at",
         updatedAt: "updated_at",
         deletedAt: "deleted_at",
         charset: "utf8mb4",
         collate: "utf8mb4_unicode_ci",
      }
   );

   return Group;
};
