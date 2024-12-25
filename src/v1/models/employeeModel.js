"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
   class Employee extends Model {
      static associate(models) {
         Employee.belongsTo(models.Office, {
            foreignKey: "office_id",
            as: "employee_belongto_office",
         });
         Employee.belongsTo(models.EmployeeType, {
            foreignKey: "employee_type_id",
            as: "employee_belongto_employeeType",
         });
         Employee.hasMany(models.GroupEmployee, {
            foreignKey: "employee_id",
            as: "employee_to_groupEmployee",
         });
         Employee.belongsToMany(models.Group, {
            through: models.GroupEmployee,
            foreignKey: "employee_id",
            otherKey: "group_id",
            as: "employee_to_group",
         });
         Employee.hasMany(models.Article, {
            foreignKey: "employee_id",
            as: "employee_to_article",
         });
         Employee.hasOne(models.Driver, {
            foreignKey: "employee_id",
            as: "employee_onetoOne_driver",
         });
         Employee.hasMany(models.Voucher, {
            foreignKey: "voucher_created_by",
            as: "employee_to_voucher",
         });
         Employee.hasMany(models.TripEmployee, {
            foreignKey: "employee_id",
            as: "employee_to_tripEmployee",
         });
         Employee.hasMany(models.Refund, {
            foreignKey: "employee_id",
            as: "employee_to_refund",
         });
         Employee.belongsToMany(models.Trip, {
            through: models.TripEmployee,
            foreignKey: "employee_id",
            otherKey: "trip_id",
            as: "employee_to_trip",
         });
      }
   }

   Employee.init(
      {
         employee_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
         },
         employee_full_name: {
            type: DataTypes.STRING(500),
            allowNull: false,
         },
         employee_email: {
            type: DataTypes.STRING(500),
            allowNull: false,
            unique: true,
         },
         employee_phone: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true,
         },
         employee_username: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
         },
         employee_birthday: {
            type: DataTypes.DATEONLY,
            validate: {
               isBetween(value) {
                  if (value < "1900-01-01" || value > "2100-12-31") {
                     throw new Error("Birthday must be between 1900-01-01 and 2100-12-31");
                  }
               },
            },
         },
         employee_password: {
            type: DataTypes.TEXT("long"),
            allowNull: false,
         },
         employee_profile_image: {
            type: DataTypes.TEXT("long"),
            allowNull: true,
         },
         employee_gender: {
            type: DataTypes.TINYINT(1),
            allowNull: true,
            validate: {
               isIn: [[0, 1, -1]],
            },
         },
         is_first_activation: {
            type: DataTypes.TINYINT(1),
            defaultValue: 1,
            validate: {
               isIn: [[0, 1]],
            },
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
         office_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
               model: "Office",
               key: "office_id",
            },
         },
         employee_type_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
               model: "EmployeeType",
               key: "employee_type_id",
            },
         },
      },
      {
         sequelize,
         modelName: "Employee",
         tableName: "employees",
         underscored: true,
         timestamps: true,
         paranoid: true,
         freezeTableName: true,
         indexes: [
            {
               unique: true,
               fields: ["employee_username", "employee_email", "employee_phone"],
            },
         ],
         createdAt: "created_at",
         updatedAt: "updated_at",
         deletedAt: "deleted_at",
         charset: "utf8mb4",
         collate: "utf8mb4_unicode_ci",
      }
   );

   return Employee;
};
