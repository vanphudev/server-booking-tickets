"use strict";
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
   class Role extends Model {
      static associate(models) {
         Role.belongsToMany(models.Group, {
            through: models.RoleGroup,
            foreignKey: "role_id",
            otherKey: "group_id",
            as: "role_to_group",
         });
         Role.hasMany(models.RoleGroup, {
            foreignKey: "role_id",
            as: "role_to_roleGroup",
         });
      }
   }

   Role.init(
      {
         role_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
         },
         role_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
         },
         role_description: {
            type: DataTypes.STRING(500),
         },
         role_value_url: {
            type: DataTypes.TEXT("long"),
            allowNull: false,
            unique: true,
         },
         is_locked: {
            type: DataTypes.TINYINT(1),
            defaultValue: 0,
            validate: {isIn: [[0, 1]]},
         },
      },
      {
         sequelize,
         modelName: "Role",
         tableName: "roles",
         underscored: true,
         timestamps: true,
         paranoid: true,
         freezeTableName: true,
         indexes: [
            {
               unique: true,
               fields: ["role_id", "role_name", "role_value_url"],
            },
         ],
         createdAt: "created_at",
         updatedAt: "updated_at",
         deletedAt: "deleted_at",
         charset: "utf8mb4",
         collate: "utf8mb4_unicode_ci",
      }
   );

   return Role;
};
