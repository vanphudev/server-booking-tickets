"use strict";
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
   class RoleGroup extends Model {
      static associate(models) {
         RoleGroup.belongsTo(models.Role, {
            foreignKey: "role_id",
            as: "roleGroup_belongto_Role",
         });
         RoleGroup.belongsTo(models.Group, {
            foreignKey: "group_id",
            as: "roleGroup_belongto_Group",
         });
      }
   }

   RoleGroup.init(
      {
         role_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
               model: "Role",
               key: "role_id",
            },
         },
         group_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
               model: "Group",
               key: "group_id",
            },
         },
      },
      {
         sequelize,
         modelName: "RoleGroup",
         tableName: "role_groups",
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

   return RoleGroup;
};
