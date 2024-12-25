"use strict";

const bcrypt = require("bcrypt");

function getRandomElement(arr) {
   return arr[Math.floor(Math.random() * (arr.length - 1))];
}

module.exports = {
   up: async (queryInterface, Sequelize) => {
      const customerTypes = await queryInterface.sequelize.query(`SELECT customer_type_id FROM customer_types;`);
      const typeRows = customerTypes[0];
      const hashedPassword = await bcrypt.hash("Password@123", 10);

      return queryInterface.bulkInsert(
         "customers",
         [
            {
               customer_full_name: "Nguyễn Văn A",
               customer_phone: "0123456789",
               customer_email: "nguyenvana@example.com",
               customer_gender: 1,
               customer_birthday: "1990-01-01",
               customer_avatar_url: "http://example.com/avatar1.jpg",
               customer_avatar_public_id: "avatar1",
               customer_destination_address: JSON.stringify({
                  province: "Hà Nội",
                  district: "Ba Đình",
                  wards: "Phúc Xá",
               }),
               customer_password: hashedPassword,
               is_disabled: 0,
               last_login_at: new Date(),
               customer_type_id: getRandomElement(typeRows).customer_type_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               customer_full_name: "Trần Thị B",
               customer_phone: "0987654321",
               customer_email: "tranthib@example.com",
               customer_gender: 0,
               customer_birthday: "1985-05-15",
               customer_avatar_url: "http://example.com/avatar2.jpg",
               customer_avatar_public_id: "avatar2",
               customer_destination_address: JSON.stringify({
                  province: "Hồ Chí Minh",
                  district: "Quận 1",
                  wards: "Bến Nghé",
               }),
               customer_password: hashedPassword,
               is_disabled: 0,
               last_login_at: new Date(),
               customer_type_id: getRandomElement(typeRows).customer_type_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               customer_full_name: "Nguyễn Văn C",
               customer_phone: "0987654322",
               customer_email: "nguyenvanc@example.com",
               customer_gender: 1,
               customer_birthday: "1992-07-20",
               customer_avatar_url: "http://example.com/avatar3.jpg",
               customer_avatar_public_id: "avatar3",
               customer_destination_address: JSON.stringify({
                  province: "Hà Nội",
                  district: "Ba Đình",
                  wards: "Phúc Xá",
               }),
               customer_password: hashedPassword,
               is_disabled: 0,
               last_login_at: new Date(),
               customer_type_id: getRandomElement(typeRows).customer_type_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               customer_full_name: "Nguyễn Văn D",
               customer_phone: "0987654323",
               customer_email: "nguyenvand@example.com",
               customer_gender: 1,
               customer_birthday: "1994-09-10",
               customer_avatar_url: "http://example.com/avatar4.jpg",
               customer_avatar_public_id: "avatar4",
               customer_destination_address: JSON.stringify({
                  province: "Hà Nội",
                  district: "Ba Đình",
                  wards: "Phúc Xá",
               }),
               customer_password: hashedPassword,
               is_disabled: 0,
               last_login_at: new Date(),
               customer_type_id: getRandomElement(typeRows).customer_type_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               customer_full_name: "Nguyễn Văn E",
               customer_phone: "0987654324",
               customer_email: "nguyenvane@example.com",
               customer_gender: 1,
               customer_birthday: "1996-11-25",
               customer_avatar_url: "http://example.com/avatar5.jpg",
               customer_avatar_public_id: "avatar5",
               customer_destination_address: JSON.stringify({
                  province: "Hà Nội",
                  district: "Ba Đình",
                  wards: "Phúc Xá",
               }),
               customer_password: hashedPassword,
               is_disabled: 0,
               last_login_at: new Date(),
               customer_type_id: getRandomElement(typeRows).customer_type_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
         ],
         {}
      );
   },

   down: async (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete("customers", null, {});
   },
};
