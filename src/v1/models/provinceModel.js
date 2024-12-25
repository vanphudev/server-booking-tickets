"use strict";
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
   class Province extends Model {
      static associate(models) {
         Province.hasMany(models.District, {
            foreignKey: "province_id",
            as: "province_to_district",
         });
      }
   }
   Province.init(
      {
         province_id: {
            type: DataTypes.STRING(50),
            primaryKey: true,
            allowNull: false,
         },
         province_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
         },
         province_grade: {
            type: DataTypes.STRING(255),
         },
         province_description: {
            type: DataTypes.STRING(500),
         },
      },
      {
         sequelize,
         modelName: "Province",
         tableName: "provinces",
         underscored: true,
         timestamps: true,
         paranoid: true,
         freezeTableName: true,
         indexes: [
            {
               unique: true,
               fields: ["province_name", "province_id"],
            },
         ],
         createdAt: "created_at",
         updatedAt: "updated_at",
         deletedAt: "deleted_at",
         charset: "utf8mb4",
         collate: "utf8mb4_unicode_ci",
      }
   );
   return Province;
};
