"use strict";
const __RESPONSE = require("../../core");
const {validationResult} = require("express-validator");
const db = require("../../models");
const {handleUpload, deleteImage} = require("../../utils/uploadImages");
const {normalizeVietnameseString} = require("../../utils/normalizeVietnameseString");
const __VEHICLE_IMAGE_FOLDER = "vehicle_images";

const getAllVehicleImages = async (req, res) => {
   try {
      const vehicleImages = await db.VehicleImage.findAll({
         attributes: [
            "vehicle_image_id",
            "vehicle_image_url",
            "vehicle_image_description",
            "vehicle_image_public_id",
            "vehicle_id",
         ],
         include: [
            {
               model: db.Vehicle,
               as: "vehicleImage_belongto_vehicle",
               attributes: ["vehicle_id", "vehicle_code"],
            },
         ],
         nest: true,
         raw: true,
      });

      if (!vehicleImages?.length) {
         throw new __RESPONSE.NotFoundError({
            message: "Không tìm thấy hình ảnh phương tiện nào",
            suggestion: "Vui lòng kiểm tra lại yêu cầu",
            request: req,
         });
      }

      return {
         vehicleImages,
         total: vehicleImages.length,
      };
   } catch (error) {
      if (error instanceof __RESPONSE.NotFoundError) {
         throw error;
      }

      throw new __RESPONSE.BadRequestError({
         message: `Lỗi khi lấy danh sách hình ảnh: ${error.message}`,
         suggestion: "Vui lòng kiểm tra lại yêu cầu",
         request: req,
      });
   }
};

const getVehicleImageById = async (req, res) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      throw new __RESPONSE.BadRequestError({
         message: "Validation failed " + errors.array()[0]?.msg + " !",
         suggestion: "Please provide the correct data",
         request: req,
      });
   }

   const { vehicleImageId } = req.query;

   try {
      const vehicleImage = await db.VehicleImage.findOne({
         where: { vehicle_image_id: vehicleImageId },
         include: [
            {
               model: db.Vehicle,
               as: "vehicleImage_belongto_vehicle",
               attributes: ["vehicle_id", "vehicle_code"],
            },
         ],
      });

      if (!vehicleImage) {
         throw new __RESPONSE.NotFoundError({
            message: "Không tìm thấy hình ảnh phương tiện với ID " + vehicleImageId,
            suggestion: "Vui lòng kiểm tra lại ID hình ảnh",
            request: req,
         });
      }

      return {
         vehicleImage: {
            vehicle_image_id: vehicleImage.vehicle_image_id,
            vehicle_image_url: vehicleImage.vehicle_image_url,
            vehicle_image_description: vehicleImage.vehicle_image_description,
            vehicle: vehicleImage.vehicleImage_belongto_vehicle
         }
      };

   } catch (error) {
      if (error instanceof __RESPONSE.NotFoundError) {
         throw error;
      }

      throw new __RESPONSE.BadRequestError({
         message: "Lỗi khi lấy thông tin hình ảnh: " + error.message,
         suggestion: "Vui lòng thử lại",
         request: req,
      });
   }
};

const getVehicleByVehicleId = async (req, res, next) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      throw new __RESPONSE.BadRequestError({
         message: "Validation failed " + errors.array()[0]?.msg + " !",
         suggestion: "Please provide the correct data",
         request: req,
      });
   }
   const {vehicleId} = req.params;
   return await db.Vehicle.findOne({
      where: {vehicle_id: vehicleId},
      attributes: ["vehicle_id", "vehicle_code"],
   })
      .then((vehicle) => {
         if (!vehicle) {
            throw new __RESPONSE.NotFoundError({
               message: "Vehicles not found with id " + vehicleId,
               suggestion: "Please try again with correct vehicle id",
               request: req,
            });
         }
         return vehicle;
      })
      .catch((error) => {
         if (error instanceof __RESPONSE.NotFoundError) {
            throw error;
         }
         throw new __RESPONSE.BadRequestError({
            message: "Get vehicle failed " + error.message,
            suggestion: "Please try again with correct data " + error.message,
            request: req,
         });
      });
};

const createVehicleImage = async (req, res, next) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      throw new __RESPONSE.BadRequestError({
         message: "Validation failed " + errors.array()[0]?.msg + " !",
         suggestion: "Please provide the correct data",
         request: req,
      });
   }
   const {vehicleId} = req.params;
   const vehicle = await db.Vehicle.findOne({
      where: {vehicle_id: vehicleId},
      attributes: ["vehicle_id", "vehicle_code"],
   });
   if (!vehicle) {
      throw new __RESPONSE.NotFoundError({
         message: "Vehicle not found with id " + vehicleId,
         suggestion: "Please try again with correct vehicle id",
         request: req,
      });
   }

   const uploadedImages = req.uploadedImages;
   console.log("uploadedImages", uploadedImages);
   if (!uploadedImages || uploadedImages.length === 0) {
      throw new __RESPONSE.BadRequestError({
         message: "No image uploaded !",
         suggestion: "Please try again with correct data",
         request: req,
      });
   }
   try {
      const result = await db.sequelize.transaction(async (transaction) => {
         const createdImages = await Promise.all(
            uploadedImages.map(async (image) => {
               const vehicleImage = await db.VehicleImage.create(
                  {
                     vehicle_id: vehicle.vehicle_id,
                     vehicle_image_url: image.url,
                     vehicle_image_public_id: image.public_id,
                     vehicle_image_description: image.original_name,
                  },
                  {transaction}
               );
               if (!vehicleImage) {
                  throw new __RESPONSE.BadRequestError({
                     message: "Create vehicle image failed " + error.message,
                     suggestion: "Please try again with correct data " + error.message,
                     request: req,
                  });
               }
               return vehicleImage;
            })
         );
         return createdImages;
      });
      return {
         createdImages: result,
      };
   } catch (error) {
      if (error instanceof __RESPONSE.BadRequestError) {
         throw error;
      }
      throw new __RESPONSE.BadRequestError({
         message: "Create vehicle image failed " + error.message,
         suggestion: "Please try again with correct data " + error.message,
         request: req,
      });
   }
};

const deleteVehicleImage = async (req, res) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      throw new __RESPONSE.BadRequestError({
         message: "Validation failed " + errors.array()[0]?.msg + " !",
         suggestion: "Please provide the correct data",
         request: req,
      });
   }

   const { vehicleImageId } = req.query;

   try {
      const vehicleImage = await db.VehicleImage.findOne({
         where: { vehicle_image_id: vehicleImageId },
         include: [
            {
               model: db.Vehicle,
               as: "vehicleImage_belongto_vehicle",
               attributes: ["vehicle_id", "vehicle_code"],
            },
         ],
      });

      if (!vehicleImage) {
         throw new __RESPONSE.NotFoundError({
            message: "Không tìm thấy hình ảnh phương tiện với ID " + vehicleImageId,
            suggestion: "Vui lòng kiểm tra lại ID hình ảnh",
            request: req,
         });
      }

      if (vehicleImage.vehicle_image_public_id) {
         try {
            await deleteImage(vehicleImage.vehicle_image_public_id);
         } catch (cloudError) {
            console.error("Lỗi khi xóa ảnh trên cloud:", cloudError);
         }
      }

      // Xóa record trong database
      await vehicleImage.destroy();

      return {
         deletedImage: {
            vehicle_image_id: vehicleImage.vehicle_image_id,
            vehicle_image_url: vehicleImage.vehicle_image_url,
            vehicle_image_description: vehicleImage.vehicle_image_description,
            vehicle: vehicleImage.vehicleImage_belongto_vehicle
         }
      };

   } catch (error) {
      if (error instanceof __RESPONSE.NotFoundError) {
         throw error;
      }

      throw new __RESPONSE.BadRequestError({
         message: "Lỗi khi xóa hình ảnh phương tiện: " + error.message,
         suggestion: "Vui lòng thử lại",
         request: req,
      });
   }
};

// Thêm hàm tìm kiếm các ảnh đã xóa
const findAllDeleteVehicleImages = async (req, res) => {
   try {
      const vehicleImages = await db.VehicleImage.findAll({
         where: {
            deleted_at: { [db.Sequelize.Op.ne]: null }
         },
         attributes: [
            "vehicle_image_id",
            "vehicle_image_url",
            "vehicle_image_description",
            "vehicle_image_public_id",
            "vehicle_id",
            "deleted_at"
         ],
         include: [
            {
               model: db.Vehicle,
               as: "vehicleImage_belongto_vehicle",
               attributes: ["vehicle_id", "vehicle_code"],
            },
         ],
         paranoid: false, 
         nest: true,
         raw: true,
      });

      if (!vehicleImages?.length) {
         throw new __RESPONSE.NotFoundError({
            message: "Không tìm thấy hình ảnh phương tiện đã xóa nào",
            suggestion: "Danh sách hình ảnh đã xóa trống",
            request: req,
         });
      }

      return {
         vehicleImages,
         total: vehicleImages.length,
      };
   } catch (error) {
      if (error instanceof __RESPONSE.NotFoundError) {
         throw error;
      }

      throw new __RESPONSE.BadRequestError({
         message: "Lỗi khi lấy danh sách hình ảnh đã xóa: " + error.message,
         suggestion: "Vui lòng thử lại",
         request: req,
      });
   }
};

const updateVehicleImage = async (req, res) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      throw new __RESPONSE.BadRequestError({
         message: "Validation failed " + errors.array()[0]?.msg + " !",
         suggestion: "Please provide the correct data",
         request: req,
      });
   }

   const { vehicleImageId } = req.query;
   const { vehicle_image_description, vehicle_id } = req.body;

   try {
      // Tìm ảnh cần update
      const vehicleImage = await db.VehicleImage.findOne({
         where: { vehicle_image_id: vehicleImageId },
         include: [
            {
               model: db.Vehicle,
               as: "vehicleImage_belongto_vehicle",
               attributes: ["vehicle_id", "vehicle_code"],
            },
         ],
      });

      if (!vehicleImage) {
         throw new __RESPONSE.NotFoundError({
            message: "Không tìm thấy hình ảnh phương tiện với ID " + vehicleImageId,
            suggestion: "Vui lòng kiểm tra lại ID hình ảnh",
            request: req,
         });
      }

      // Nếu có vehicle_id mới, kiểm tra xe mới có tồn tại không
      if (vehicle_id) {
         const newVehicle = await db.Vehicle.findOne({
            where: { vehicle_id: vehicle_id },
            attributes: ["vehicle_id", "vehicle_code"],
         });

         if (!newVehicle) {
            throw new __RESPONSE.NotFoundError({
               message: "Không tìm thấy phương tiện với ID " + vehicle_id,
               suggestion: "Vui lòng kiểm tra lại ID phương tiện",
               request: req,
            });
         }
      }

      const updateData = {};
      
      if (req.uploadedImages && req.uploadedImages.length > 0) {
         const newImage = req.uploadedImages[0];

         if (vehicleImage.vehicle_image_public_id) {
            try {
               await deleteImage(vehicleImage.vehicle_image_public_id);
            } catch (cloudError) {
               console.error("Lỗi khi xóa ảnh cũ trên cloud:", cloudError);
            }
         }

         updateData.vehicle_image_url = newImage.url;
         updateData.vehicle_image_public_id = newImage.public_id;
      }

      if (vehicle_image_description) {
         updateData.vehicle_image_description = vehicle_image_description;
      }
      
      if (vehicle_id) {
         updateData.vehicle_id = vehicle_id;
      }

      if (Object.keys(updateData).length === 0) {
         throw new __RESPONSE.BadRequestError({
            message: "Không có thông tin cần cập nhật",
            suggestion: "Vui lòng cung cấp ít nhất một thông tin cần cập nhật",
            request: req,
         });
      }

      await vehicleImage.update(updateData);

      const updatedImage = await db.VehicleImage.findOne({
         where: { vehicle_image_id: vehicleImageId },
         include: [
            {
               model: db.Vehicle,
               as: "vehicleImage_belongto_vehicle",
               attributes: ["vehicle_id", "vehicle_code"],
            },
         ],
      });

      return {
         updatedImage: {
            vehicle_image_id: updatedImage.vehicle_image_id,
            vehicle_image_url: updatedImage.vehicle_image_url,
            vehicle_image_description: updatedImage.vehicle_image_description,
            vehicle_id: updatedImage.vehicle_id,
            vehicle: updatedImage.vehicleImage_belongto_vehicle
         }
      };

   } catch (error) {
     
      if (req.uploadedImages && req.uploadedImages.length > 0) {
         try {
            await deleteImage(req.uploadedImages[0].public_id);
         } catch (cleanupError) {
            console.error("Lỗi khi xóa ảnh mới trong quá trình rollback:", cleanupError);
         }
      }

      if (error instanceof __RESPONSE.NotFoundError) {
         throw error;
      }

      throw new __RESPONSE.BadRequestError({
         message: "Lỗi khi cập nhật hình ảnh: " + error.message,
         suggestion: "Vui lòng thử lại",
         request: req,
      });
   }
};

module.exports = {
   getAllVehicleImages,
   getVehicleImageById,
   getVehicleByVehicleId,
   createVehicleImage,
   deleteVehicleImage,
   findAllDeleteVehicleImages,
   updateVehicleImage,
};
