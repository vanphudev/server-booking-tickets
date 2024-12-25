"use strict";
const db = require("../models");

const ConnectDatabase = async () => {
   try {
      await db.sequelize.authenticate();
      console.log("Connection has been established successfully.");
   } catch (error) {
      if (error.original.code === "ECONNREFUSED") {
         console.error(
            "\nUnable to connect to the database: ",
            error.message,
            "Database not found. Please create the database first."
         );
      }
      console.error(
         "\nUnable to connect to the database: ",
         error.message,
         "Kết nối không thành công đến cơ sở dữ liệu"
      );
      return process.exit(1);
   }
};

const CloseDatabase = async () => {
   try {
      await db.sequelize.close();
      console.log("Connection has been closed successfully.");
   } catch (error) {
      console.error("\nUnable to close the database:", error);
      return process.exit(1);
   }
};

module.exports = {
   ConnectDatabase,
   CloseDatabase,
};
