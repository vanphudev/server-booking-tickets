"use strict";
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
   class Voucher extends Model {
      static associate(models) {
         Voucher.belongsTo(models.Employee, {
            foreignKey: "voucher_created_by",
            as: "voucher_belongto_employee",
         });
         Voucher.hasMany(models.BookingTicket, {
            foreignKey: "voucher_id",
            as: "voucher_to_bookingTicket",
         });
         Voucher.hasMany(models.VoucherCustomer, {
            foreignKey: "voucher_id",
            as: "voucher_to_voucherCustomer",
         });
         Voucher.belongsToMany(models.Customer, {
            through: models.VoucherCustomer,
            foreignKey: "voucher_id",
            otherKey: "customer_id",
            as: "voucher_to_customer",
         });
      }
   }

   Voucher.init(
      {
         voucher_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
         },
         voucher_code: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
         },
         voucher_discount_percentage: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0.0,
            validate: {
               min: 0,
            },
         },
         voucher_discount_max_amount: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0.0,
            validate: {
               min: 0,
            },
         },
         voucher_usage_limit: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            validate: {
               min: 1,
            },
         },
         voucher_valid_from: {
            type: DataTypes.DATE(6),
            defaultValue: DataTypes.NOW,
         },
         voucher_valid_to: {
            type: DataTypes.DATE(6),
            defaultValue: DataTypes.NOW,
         },
         voucher_created_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
               model: "Employee",
               key: "employee_id",
            },
         },
      },
      {
         sequelize,
         modelName: "Voucher",
         tableName: "vouchers",
         underscored: true,
         timestamps: true,
         paranoid: true,
         freezeTableName: true,
         indexes: [
            {
               unique: true,
               fields: ["voucher_code", "voucher_id"],
            },
         ],
         createdAt: "created_at",
         updatedAt: "updated_at",
         deletedAt: "deleted_at",
         charset: "utf8mb4",
         collate: "utf8mb4_unicode_ci",
      }
   );

   return Voucher;
};
