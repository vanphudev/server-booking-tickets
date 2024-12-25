const {Model, DataTypes} = require("sequelize");
module.exports = (sequelize) => {
   class KeyStoreCustomer extends Model {
      static associate(models) {
         KeyStoreCustomer.belongsTo(models.Customer, {
            foreignKey: "customer_id",
            as: "keyStoreCustomer_onetoOne_customer",
         });
         KeyStoreCustomer.hasMany(models.RefreshKeyUsedCustomer, {
            foreignKey: "key_store_customer_id",
            as: "keyStoreCustomer_to_refreshKeyUsedCustomer",
         });
      }
   }

   KeyStoreCustomer.init(
      {
         key_store_customer_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
         },
         public_key_customer: {
            type: DataTypes.TEXT("long"),
            allowNull: false,
         },
         private_key_customer: {
            type: DataTypes.TEXT("long"),
            allowNull: false,
         },
         refresh_token_key_customer: {
            type: DataTypes.TEXT("long"),
            allowNull: false,
         },
         customer_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            references: {
               model: {
                  tableName: "customers",
               },
               key: "customer_id",
            },
         },
      },
      {
         sequelize,
         modelName: "KeyStoreCustomer",
         tableName: "key_store_customers",
         underscored: true,
         timestamps: true,
         paranoid: false,
         freezeTableName: true,
         charset: "utf8mb4",
         collate: "utf8mb4_unicode_ci",
         indexes: [
            {
               unique: true,
               fields: ["public_key_customer", "private_key_customer", "key_store_customer_id"],
            },
         ],
         createdAt: "created_at",
         updatedAt: "updated_at",
         deletedAt: "deleted_at",
      }
   );

   return KeyStoreCustomer;
};
