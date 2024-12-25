"use strict";
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
   class VoucherCustomer extends Model {
      static associate(models) {
         VoucherCustomer.belongsTo(models.Customer, {
            foreignKey: "customer_id",
            as: "voucherCustomer_belongto_customer",
         });
         VoucherCustomer.belongsTo(models.Voucher, {
            foreignKey: "voucher_id",
            as: "voucherCustomer_belongto_voucher",
         });
      }
   }

   VoucherCustomer.init(
      {
         voucher_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
               model: "Voucher",
               key: "voucher_id",
            },
         },
         customer_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
               model: "Customer",
               key: "customer_id",
            },
         },
      },
      {
         sequelize,
         modelName: "VoucherCustomer",
         tableName: "voucher_customers",
         underscored: true,
         timestamps: true,
         paranoid: true,
         freezeTableName: true,
         indexes: [
            {
               unique: true,
               fields: ["voucher_id", "customer_id"],
            },
         ],
         createdAt: "created_at",
         updatedAt: "updated_at",
         deletedAt: "deleted_at",
         charset: "utf8mb4",
         collate: "utf8mb4_unicode_ci",
      }
   );

   return VoucherCustomer;
};
