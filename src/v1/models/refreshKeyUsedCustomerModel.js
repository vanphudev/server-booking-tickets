const {Model, DataTypes} = require("sequelize");

module.exports = (sequelize) => {
   class RefreshKeyUsedCustomer extends Model {
      static associate(models) {
         RefreshKeyUsedCustomer.belongsTo(models.KeyStoreCustomer, {
            foreignKey: "key_store_customer_id",
            as: "refreshKeyUsedCustomer_belongto_keyStoreCustomer",
            onDelete: "CASCADE",
         });
      }
   }

   RefreshKeyUsedCustomer.init(
      {
         refreshkey_used_customer_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
         },
         key_store_customer_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
               model: "KeyStoreCustomer",
               key: "key_store_customer_id",
            },
            onDelete: "CASCADE",
         },
         refreshkey_used_customer_key: {
            type: DataTypes.TEXT("long"),
            allowNull: false,
         },
         used_at: {
            type: DataTypes.DATE(6),
            defaultValue: DataTypes.NOW,
         },
      },
      {
         sequelize,
         modelName: "RefreshKeyUsedCustomer",
         tableName: "refresh_key_used_customers",
         underscored: true,
         timestamps: true,
         paranoid: true,
         freezeTableName: true,
         indexes: [
            {
               unique: true,
               fields: ["key_store_customer_id", "refreshkey_used_customer_id"],
            },
         ],
         charset: "utf8mb4",
         collate: "utf8mb4_unicode_ci",
         createdAt: "created_at",
         updatedAt: "updated_at",
         deletedAt: "deleted_at",
      }
   );

   return RefreshKeyUsedCustomer;
};
