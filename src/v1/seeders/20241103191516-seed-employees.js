"use strict";

const bcrypt = require("bcrypt");
function getRandomElement(arr) {
   return arr[Math.floor(Math.random() * (arr.length - 1))];
}

module.exports = {
   up: async (queryInterface, Sequelize) => {
      const offices = await queryInterface.sequelize.query(`SELECT office_id FROM offices;`);
      const officeRows = offices[0];
      const employeeTypes = await queryInterface.sequelize.query(`SELECT employee_type_id FROM employee_types;`);
      const typeRows = employeeTypes[0];
      const hashedPassword = await bcrypt.hash("Password@123", 10);

      return queryInterface.bulkInsert(
         "employees",
         [
            {
               employee_full_name: "Nguyễn Văn A",
               employee_email: "nguyenvana@example.com",
               employee_phone: "0123456789",
               employee_username: "nguyenvana",
               employee_birthday: "1990-01-01",
               employee_password: hashedPassword,
               employee_gender: 1,
               office_id: getRandomElement(officeRows).office_id,
               employee_type_id: getRandomElement(typeRows).employee_type_id,
            },
            {
               employee_full_name: "Trần Thị B",
               employee_email: "tranthib@example.com",
               employee_phone: "0987654321",
               employee_username: "tranthib",
               employee_birthday: "1985-05-15",
               employee_password: hashedPassword,
               employee_gender: 0,
               office_id: getRandomElement(officeRows).office_id,
               employee_type_id: getRandomElement(typeRows).employee_type_id,
            },
            {
               employee_full_name: "Lê Văn C",
               employee_email: "levanc@example.com",
               employee_phone: "0912345678",
               employee_username: "levanc",
               employee_birthday: "1992-07-20",
               employee_password: hashedPassword,
               employee_gender: 1,
               office_id: getRandomElement(officeRows).office_id,
               employee_type_id: getRandomElement(typeRows).employee_type_id,
            },
            {
               employee_full_name: "Phạm Thị D",
               employee_email: "phamthid@example.com",
               employee_phone: "0934567890",
               employee_username: "phamthid",
               employee_birthday: "1988-03-10",
               employee_password: hashedPassword,
               employee_gender: 0,
               office_id: getRandomElement(officeRows).office_id,
               employee_type_id: getRandomElement(typeRows).employee_type_id,
            },
            {
               employee_full_name: "Hoàng Văn E",
               employee_email: "hoangvane@example.com",
               employee_phone: "0945678901",
               employee_username: "hoangvane",
               employee_birthday: "1995-11-30",
               employee_password: hashedPassword,
               employee_gender: 1,
               office_id: getRandomElement(officeRows).office_id,
               employee_type_id: getRandomElement(typeRows).employee_type_id,
            },
            {
               employee_full_name: "Đỗ Thị F",
               employee_email: "dothif@example.com",
               employee_phone: "0956789012",
               employee_username: "dothif",
               employee_birthday: "1991-06-25",
               employee_password: hashedPassword,
               employee_gender: 0,
               office_id: getRandomElement(officeRows).office_id,
               employee_type_id: getRandomElement(typeRows).employee_type_id,
            },
            {
               employee_full_name: "Vũ Văn G",
               employee_email: "vuvang@example.com",
               employee_phone: "0967890123",
               employee_username: "vuvang",
               employee_birthday: "1987-09-15",
               employee_password: hashedPassword,
               employee_gender: 1,
               office_id: getRandomElement(officeRows).office_id,
               employee_type_id: getRandomElement(typeRows).employee_type_id,
            },
            {
               employee_full_name: "Ngô Thị H",
               employee_email: "ngothih@example.com",
               employee_phone: "0978901234",
               employee_username: "ngothih",
               employee_birthday: "1993-02-05",
               employee_password: hashedPassword,
               employee_gender: 0,
               office_id: getRandomElement(officeRows).office_id,
               employee_type_id: getRandomElement(typeRows).employee_type_id,
            },
            {
               employee_full_name: "Bùi Văn I",
               employee_email: "buivani@example.com",
               employee_phone: "0989012345",
               employee_username: "buivani",
               employee_birthday: "1994-12-12",
               employee_password: hashedPassword,
               employee_gender: 1,
               office_id: getRandomElement(officeRows).office_id,
               employee_type_id: getRandomElement(typeRows).employee_type_id,
            },
            {
               employee_full_name: "Đặng Thị J",
               employee_email: "dangthij@example.com",
               employee_phone: "0990123456",
               employee_username: "dangthij",
               employee_birthday: "1996-04-18",
               employee_password: hashedPassword,
               employee_gender: 0,
               office_id: getRandomElement(officeRows).office_id,
               employee_type_id: getRandomElement(typeRows).employee_type_id,
            },
            {
               employee_full_name: "Nguyễn Văn K",
               employee_email: "nguyenvank@example.com",
               employee_phone: "0901234567",
               employee_username: "nguyenvank",
               employee_birthday: "1997-03-10",
               employee_password: hashedPassword,
               employee_gender: 1,
               office_id: getRandomElement(officeRows).office_id,
               employee_type_id: getRandomElement(typeRows).employee_type_id,
            },
         ],
         {}
      );
   },

   down: async (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete("employees", null, {});
   },
};
