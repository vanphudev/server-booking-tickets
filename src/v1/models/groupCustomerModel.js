"use strict";
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
   class GroupCustomer extends Model {
      static associate(models) {
         GroupCustomer.belongsTo(models.Group, {
            foreignKey: "group_id",
            as: "groupCustomer_belongTo_group",
         });
         GroupCustomer.belongsTo(models.Customer, {
            foreignKey: "customer_id",
            as: "groupCustomer_belongTo_customer",
         });
      }
   }

   GroupCustomer.init(
      {
         group_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
               model: "Group",
               key: "group_id",
            },
         },
         customer_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
               model: "Customer",
               key: "customer_id",
            },
         },
      },
      {
         sequelize,
         modelName: "GroupCustomer",
         tableName: "group_customers",
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

   return GroupCustomer;
};
