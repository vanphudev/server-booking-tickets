"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
   class Customer extends Model {
      static associate(models) {
         Customer.hasMany(models.BookingTicket, {
            foreignKey: "customer_id",
            as: "customer_to_bookingTicket",
         });
         Customer.hasMany(models.Review, {
            foreignKey: "customer_id",
            as: "customer_to_review",
         });
         Customer.hasOne(models.KeyStoreCustomer, {
            foreignKey: "customer_id",
            as: "customer_to_keyStoreCustomer",
         });
         Customer.hasMany(models.VoucherCustomer, {
            foreignKey: "customer_id",
            as: "customer_to_voucherCustomer",
         });
         Customer.belongsToMany(models.Voucher, {
            through: models.VoucherCustomer,
            foreignKey: "customer_id",
            otherKey: "voucher_id",
            as: "customer_to_voucher",
         });
      }
   }
   Customer.init(
      {
         customer_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
         },
         customer_full_name: DataTypes.STRING(255),
         customer_phone: {
            type: DataTypes.STRING(20),
            unique: true,
         },
         customer_email: {
            type: DataTypes.STRING(500),
            unique: true,
         },
         customer_gender: {
            type: DataTypes.TINYINT,
            validate: { isIn: [[0, 1, -1]] },
         },
         customer_birthday: {
            type: DataTypes.DATEONLY,
            validate: { isAfter: "1900-01-01", isBefore: "2100-12-31" },
         },
         customer_avatar: {
            type: DataTypes.TEXT("long"),
            validate: {
               notEmpty: true,
            },
         },
         bonus_point: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
         },
         customer_destination_address: {
            type: DataTypes.JSON,
         },
         customer_password: DataTypes.STRING(500),
         is_disabled: {
            type: DataTypes.TINYINT,
            defaultValue: 0,
            validate: { isIn: [[0, 1]] },
         },
      },
      {
         sequelize,
         modelName: "Customer",
         tableName: "customers",
         underscored: true,
         timestamps: true,
         paranoid: true,
         freezeTableName: true,
         indexes: [
            {
               unique: true,
               fields: ["customer_email", "customer_phone"],
            },
         ],
         createdAt: "created_at",
         updatedAt: "updated_at",
         deletedAt: "deleted_at",
         charset: "utf8mb4",
         collate: "utf8mb4_unicode_ci",
      }
   );
   return Customer;
};
