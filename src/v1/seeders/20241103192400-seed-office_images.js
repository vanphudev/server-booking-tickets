"use strict";

function getRandomElement(arr) {
   return arr[Math.floor(Math.random() * (arr.length - 1))];
}

module.exports = {
   up: async (queryInterface, Sequelize) => {
      const offices = await queryInterface.sequelize.query(`SELECT office_id FROM offices;`);
      const officeRows = offices[0];

      return queryInterface.bulkInsert(
         "office_images",
         [
            {
               office_image_url: "http://example.com/office1-image1.jpg",
               office_image_description: "Front view of the office.",
               office_image_public_id: "office1-image1",
               office_id: getRandomElement(officeRows).office_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               office_image_url: "http://example.com/office1-image2.jpg",
               office_image_description: "Reception area of the office.",
               office_image_public_id: "office1-image2",
               office_id: getRandomElement(officeRows).office_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               office_image_url: "http://example.com/office2-image1.jpg",
               office_image_description: "Conference room in the office.",
               office_image_public_id: "office2-image1",
               office_id: getRandomElement(officeRows).office_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               office_image_url: "http://example.com/office2-image2.jpg",
               office_image_description: "Workstations in the office.",
               office_image_public_id: "office2-image2",
               office_id: getRandomElement(officeRows).office_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               office_image_url: "http://example.com/office3-image1.jpg",
               office_image_description: "Pantry area in the office.",
               office_image_public_id: "office3-image1",
               office_id: getRandomElement(officeRows).office_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               office_image_url: "http://example.com/office3-image2.jpg",
               office_image_description: "Meeting room in the office.",
               office_image_public_id: "office3-image2",
               office_id: getRandomElement(officeRows).office_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               office_image_url: "http://example.com/office4-image1.jpg",
               office_image_description: "Lobby area of the office.",
               office_image_public_id: "office4-image1",
               office_id: getRandomElement(officeRows).office_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               office_image_url: "http://example.com/office4-image2.jpg",
               office_image_description: "Exterior view of the office building.",
               office_image_public_id: "office4-image2",
               office_id: getRandomElement(officeRows).office_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               office_image_url: "http://example.com/office5-image1.jpg",
               office_image_description: "Parking area of the office.",
               office_image_public_id: "office5-image1",
               office_id: getRandomElement(officeRows).office_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               office_image_url: "http://example.com/office5-image2.jpg",
               office_image_description: "Rooftop view of the office.",
               office_image_public_id: "office5-image2",
               office_id: getRandomElement(officeRows).office_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
         ],
         {}
      );
   },

   down: async (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete("office_images", null, {});
   },
};
