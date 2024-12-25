"use strict";
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
   class Ward extends Model {
      static associate(models) {
         Ward.belongsTo(models.District, {
            foreignKey: "district_id",
            as: "ward_belongto_district",
         });
         Ward.hasMany(models.Office, {
            foreignKey: "office_id",
            as: "ward_to_office",
         });
      }
   }
   Ward.init(
      {
         ward_id: {
            type: DataTypes.STRING(50),
            primaryKey: true,
            allowNull: false,
         },
         ward_name: {
            type: DataTypes.STRING(255),
         },
         ward_description: {
            type: DataTypes.STRING(255),
         },
         ward_grade: {
            type: DataTypes.STRING(500),
         },
         district_id: {
            type: DataTypes.STRING(50),
            references: {
               model: "District",
               key: "district_id",
            },
         },
      },
      {
         sequelize,
         modelName: "Ward",
         tableName: "wards",
         underscored: true,
         timestamps: true,
         paranoid: true,
         freezeTableName: true,
         indexes: [
            {
               unique: true,
               fields: ["ward_name", "ward_id"],
            },
         ],
         createdAt: "created_at",
         updatedAt: "updated_at",
         deletedAt: "deleted_at",
         charset: "utf8mb4",
         collate: "utf8mb4_unicode_ci",
      }
   );
   return Ward;
};
