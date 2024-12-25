const {Model, DataTypes} = require("sequelize");
module.exports = (sequelize) => {
   class KeyStoreEmployee extends Model {
      static associate(models) {
         KeyStoreEmployee.belongsTo(models.Employee, {
            foreignKey: "employee_id",
            as: "keyStoreEmployee_onetoOne_employee",
         });
         KeyStoreEmployee.hasMany(models.RefreshKeyUsedEmployee, {
            foreignKey: "key_store_employee_id",
            as: "keyStoreEmployee_to_refreshKeyUsedEmployee",
         });
      }
   }

   KeyStoreEmployee.init(
      {
         key_store_employee_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
         },
         public_key_employee: {
            type: DataTypes.TEXT("long"),
            allowNull: false,
         },
         private_key_employee: {
            type: DataTypes.TEXT("long"),
            allowNull: false,
         },
         refresh_token_key_employee: {
            type: DataTypes.TEXT("long"),
            allowNull: false,
         },
         employee_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            references: {
               model: {
                  tableName: "employees",
               },
               key: "employee_id",
            },
         },
      },
      {
         sequelize,
         modelName: "KeyStoreEmployee",
         tableName: "key_store_employees",
         underscored: true,
         timestamps: true,
         paranoid: false,
         freezeTableName: true,
         charset: "utf8mb4",
         collate: "utf8mb4_unicode_ci",
         indexes: [
            {
               unique: true,
               fields: ["public_key_employee", "private_key_employee", "key_store_employee_id"],
            },
         ],
         createdAt: "created_at",
         updatedAt: "updated_at",
         deletedAt: "deleted_at",
      }
   );

   return KeyStoreEmployee;
};
