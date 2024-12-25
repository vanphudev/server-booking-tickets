const {Model, DataTypes} = require("sequelize");

module.exports = (sequelize) => {
   class RefreshKeyUsedEmployee extends Model {
      static associate(models) {
         RefreshKeyUsedEmployee.belongsTo(models.KeyStoreEmployee, {
            foreignKey: "key_store_employee_id",
            as: "refreshKeyUsedEmployee_belongto_keyStoreEmployee",
            onDelete: "CASCADE",
         });
      }
   }

   RefreshKeyUsedEmployee.init(
      {
         refreshkey_used_employee_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
         },
         key_store_employee_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
               model: "KeyStoreEmployee",
               key: "key_store_employee_id",
            },
            onDelete: "CASCADE",
         },
         refreshkey_used_employee_key: {
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
         modelName: "RefreshKeyUsedEmployee",
         tableName: "refresh_key_used_employees",
         underscored: true,
         timestamps: true,
         paranoid: true,
         freezeTableName: true,
         indexes: [
            {
               unique: true,
               fields: ["key_store_employee_id", "refreshkey_used_employee_id"],
            },
         ],
         charset: "utf8mb4",
         collate: "utf8mb4_unicode_ci",
         createdAt: "created_at",
         updatedAt: "updated_at",
         deletedAt: "deleted_at",
      }
   );

   return RefreshKeyUsedEmployee;
};
