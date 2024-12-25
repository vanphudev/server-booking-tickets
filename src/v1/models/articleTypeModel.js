"use strict";
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
   class ArticleType extends Model {
      static associate(models) {
         ArticleType.hasMany(models.Article, {
            foreignKey: "article_type_id",
            as: "articleType_to_article",
         });
      }
   }

   ArticleType.init(
      {
         article_type_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
         },
         article_title: {
            type: DataTypes.STRING(500),
            allowNull: false,
            unique: true,
         },
         article_field: {
            type: DataTypes.TEXT("long"),
            allowNull: false,
            unique: true,
         },
         is_highlight: {
            type: DataTypes.TINYINT,
            defaultValue: 0,
            validate: {
               isIn: [[0, 1]],
            },
         },
      },
      {
         sequelize,
         modelName: "ArticleType",
         tableName: "article_types",
         underscored: true,
         timestamps: true,
         paranoid: true,
         freezeTableName: true,
         indexes: [
            {
               unique: true,
               fields: ["article_field", "article_title"],
            },
         ],
         createdAt: "created_at",
         updatedAt: "updated_at",
         deletedAt: "deleted_at",
         charset: "utf8mb4",
         collate: "utf8mb4_unicode_ci",
      }
   );

   return ArticleType;
};
