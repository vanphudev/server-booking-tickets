"use strict";

function getRandomElement(arr) {
   return arr[Math.floor(Math.random() * (arr.length - 1))];
}

module.exports = {
   up: async (queryInterface, Sequelize) => {
      const vehicles = await queryInterface.sequelize.query(`SELECT vehicle_id FROM vehicles;`);
      const vehicleRows = vehicles[0];

      return queryInterface.bulkInsert(
         "vehicle_images",
         [
            {
               vehicle_image_url: "http://example.com/vehicle1-image1.jpg",
               vehicle_image_description: "Front view of the vehicle.",
               vehicle_image_public_id: "vehicle1-image1",
               vehicle_id: getRandomElement(vehicleRows).vehicle_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               vehicle_image_url: "http://example.com/vehicle1-image2.jpg",
               vehicle_image_description: "Side view of the vehicle.",
               vehicle_image_public_id: "vehicle1-image2",
               vehicle_id: getRandomElement(vehicleRows).vehicle_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               vehicle_image_url: "http://example.com/vehicle2-image1.jpg",
               vehicle_image_description: "Interior view of the vehicle.",
               vehicle_image_public_id: "vehicle2-image1",
               vehicle_id: getRandomElement(vehicleRows).vehicle_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               vehicle_image_url: "http://example.com/vehicle2-image2.jpg",
               vehicle_image_description: "Rear view of the vehicle.",
               vehicle_image_public_id: "vehicle2-image2",
               vehicle_id: getRandomElement(vehicleRows).vehicle_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               vehicle_image_url: "http://example.com/vehicle3-image1.jpg",
               vehicle_image_description: "Dashboard view of the vehicle.",
               vehicle_image_public_id: "vehicle3-image1",
               vehicle_id: getRandomElement(vehicleRows).vehicle_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               vehicle_image_url: "http://example.com/vehicle3-image2.jpg",
               vehicle_image_description: "Engine view of the vehicle.",
               vehicle_image_public_id: "vehicle3-image2",
               vehicle_id: getRandomElement(vehicleRows).vehicle_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               vehicle_image_url: "http://example.com/vehicle4-image1.jpg",
               vehicle_image_description: "Tire view of the vehicle.",
               vehicle_image_public_id: "vehicle4-image1",
               vehicle_id: getRandomElement(vehicleRows).vehicle_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               vehicle_image_url: "http://example.com/vehicle4-image2.jpg",
               vehicle_image_description: "Trunk view of the vehicle.",
               vehicle_image_public_id: "vehicle4-image2",
               vehicle_id: getRandomElement(vehicleRows).vehicle_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               vehicle_image_url: "http://example.com/vehicle5-image1.jpg",
               vehicle_image_description: "Roof view of the vehicle.",
               vehicle_image_public_id: "vehicle5-image1",
               vehicle_id: getRandomElement(vehicleRows).vehicle_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               vehicle_image_url: "http://example.com/vehicle5-image2.jpg",
               vehicle_image_description: "Seat view of the vehicle.",
               vehicle_image_public_id: "vehicle5-image2",
               vehicle_id: getRandomElement(vehicleRows).vehicle_id,
               created_at: new Date(),
               updated_at: new Date(),
            },
         ],
         {}
      );
   },

   down: async (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete("vehicle_images", null, {});
   },
};
