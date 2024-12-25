"use strict";
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
   class Refund extends Model {
      static associate(models) {
         Refund.belongsTo(models.Ticket, {
            foreignKey: "ticket_id",
            as: "refund_belongto_ticket",
         });
         Refund.belongsTo(models.Employee, {
            foreignKey: "employee_id",
            as: "refund_belongto_employee",
         });
      }
   }
   Refund.init(
      {
         refund_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
         },
         refund_code: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
         },
         ticket_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
               model: "Ticket",
               key: "ticket_id",
            },
         },
         refund_amount: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0.0,
            allowNull: false,
            validate: {
               min: 0,
            },
         },
         refund_description: {
            type: DataTypes.STRING(500),
         },
         refund_percentage: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0.0,
            allowNull: false,
            validate: {
               min: 0,
               max: 100,
            },
         },
         employee_id: {
            type: DataTypes.INTEGER,
            references: {
               model: "Employee",
               key: "employee_id",
            },
         },
         refunded_at: {
            type: DataTypes.DATE(6),
            allowNull: true,
         },
         is_refunded: {
            type: DataTypes.TINYINT,
            defaultValue: 0,
            validate: {
               isIn: [[0, 1]],
            },
         },
         refund_method: {
            type: DataTypes.STRING(255),
            validate: {
               isIn: [["online", "in_office"]],
            },
         },
         is_approved: {
            type: DataTypes.TINYINT,
            defaultValue: 0,
            validate: {
               isIn: [[0, 1]],
            },
         },
      },
      {
         sequelize,
         modelName: "Refund",
         tableName: "refunds",
         underscored: true,
         timestamps: true,
         paranoid: true,
         freezeTableName: true,
         indexes: [
            {
               unique: true,
               fields: ["refund_id", "refund_code"],
            },
         ],
         createdAt: "created_at",
         updatedAt: "updated_at",
         deletedAt: "deleted_at",
         charset: "utf8mb4",
         collate: "utf8mb4_unicode_ci",
      }
   );

   return Refund;
};
