"use strict";
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
   class OfficeImage extends Model {
      static associate(models) {
         OfficeImage.belongsTo(models.Office, {
            foreignKey: "office_id",
            as: "officeImage_belongto_office",
         });
      }
   }

   OfficeImage.init(
      {
         office_image_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
         },
         office_image_url: {
            type: DataTypes.TEXT("long"),
            allowNull: false,
         },
         office_image_description: {
            type: DataTypes.TEXT("long"),
         },
         office_image_public_id: {
            type: DataTypes.TEXT("long"),
            allowNull: false,
         },
         office_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
               model: "Office",
               key: "office_id",
            },
         },
      },
      {
         sequelize,
         modelName: "OfficeImage",
         tableName: "office_images",
         underscored: true,
         timestamps: true,
         paranoid: false,
         freezeTableName: true,
         indexes: [
            {
               unique: true,
               fields: ["office_image_id"],
            },
         ],
         createdAt: "created_at",
         updatedAt: "updated_at",
         deletedAt: "deleted_at",
         charset: "utf8mb4",
         collate: "utf8mb4_unicode_ci",
      }
   );

   return OfficeImage;
};
