"use strict";
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
   class District extends Model {
      static associate(models) {
         District.belongsTo(models.Province, {
            foreignKey: "province_id",
            as: "district_belongto_province",
         });
         District.hasMany(models.Ward, {
            foreignKey: "district_id",
            as: "district_to_ward",
         });
      }
   }
   District.init(
      {
         district_id: {
            type: DataTypes.STRING(50),
            primaryKey: true,
            allowNull: false,
         },
         district_name: {
            type: DataTypes.STRING(255),
            unique: true,
         },
         district_description: {
            type: DataTypes.STRING(500),
         },
         district_grade: {
            type: DataTypes.STRING(255),
         },
         province_id: {
            type: DataTypes.STRING(50),
            references: {
               model: "Province",
               key: "province_id",
            },
         },
      },
      {
         sequelize,
         modelName: "District",
         tableName: "districts",
         underscored: true,
         timestamps: true,
         paranoid: true,
         freezeTableName: true,
         indexes: [
            {
               unique: true,
               fields: ["district_name", "district_id"],
            },
         ],
         createdAt: "created_at",
         updatedAt: "updated_at",
         deletedAt: "deleted_at",
         charset: "utf8mb4",
         collate: "utf8mb4_unicode_ci",
      }
   );
   return District;
};
