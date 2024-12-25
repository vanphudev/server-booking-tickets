"use strict";
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
   class PaymentMethod extends Model {
      static associate(models) {
         PaymentMethod.hasMany(models.BookingTicket, {
            foreignKey: "payment_method_id",
            as: "paymentMethod_to_bookingTicket",
         });
      }
   }

   PaymentMethod.init(
      {
         payment_method_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
         },
         payment_method_code: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
         },
         payment_method_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
         },
         is_locked: {
            type: DataTypes.TINYINT(1),
            defaultValue: 0,
            validate: {
               isIn: [[0, 1]],
            },
         },
         last_lock_at: {
            type: DataTypes.DATE(6),
            allowNull: true,
         },
         payment_method_description: {
            type: DataTypes.TEXT("long"),
            allowNull: true,
         },
      },
      {
         sequelize,
         modelName: "PaymentMethod",
         tableName: "payment_methods",
         underscored: true,
         timestamps: true,
         paranoid: true,
         freezeTableName: true,
         indexes: [
            {
               unique: true,
               fields: ["payment_method_id", "payment_method_code", "payment_method_name"],
            },
         ],
         createdAt: "created_at",
         updatedAt: "updated_at",
         deletedAt: "deleted_at",
         charset: "utf8mb4",
         collate: "utf8mb4_unicode_ci",
      }
   );

   return PaymentMethod;
};
