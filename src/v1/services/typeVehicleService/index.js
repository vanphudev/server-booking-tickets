"use strict";
const __RESPONSE = require("../../core");
const {validationResult} = require("express-validator");
const db = require("../../models");
const {handleUpload, deleteImage} = require("../../utils/uploadImages");
const {normalizeVietnameseString} = require("../../utils/normalizeVietnameseString");
const __VEHICLE_IMAGE_FOLDER = "vehicle_images";

const getAllVehicleTypes = async (req) => {
   try {
      const vehicleTypes = await db.VehicleType.findAll({
         attributes: [
            "vehicle_type_id",
            "vehicle_type_name", 
            "vehicle_type_description",
         ],
         include: [
            {
               model: db.Vehicle,
               as: "vehicleType_to_vehicle",
               attributes: [
                  "vehicle_id",
                  "vehicle_code",
                  "vehicle_license_plate",
                  "vehicle_model",
                  "vehicle_brand",
                  "vehicle_capacity"
               ]
            }
         ],
         nest: true,
         raw: true
      });

      if (!vehicleTypes?.length) {
         throw new __RESPONSE.NotFoundError({
            message: "Không tìm thấy loại phương tiện nào",
            suggestion: "Vui lòng kiểm tra lại yêu cầu",
            request: req
         });
      }

      return {
         vehicleTypes,
         total: vehicleTypes.length
      };

   } catch (error) {
      if (error instanceof __RESPONSE.NotFoundError) {
         throw error;
      }
      
      throw new __RESPONSE.BadRequestError({
         message: `Lỗi khi lấy danh sách loại phương tiện: ${error.message}`,
         suggestion: "Vui lòng kiểm tra lại yêu cầu",
         request: req
      });
   }
};

const getVehicleTypeById = async (req) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      throw new __RESPONSE.BadRequestError({
         message: "Validation failed " + errors.array()[0]?.msg + " !",
         suggestion: "Please provide the correct data",
         request: req,
      });
   }
   const {vehicleTypeId} = req.query;
   return await db.VehicleType.findOne({
      where: {
         vehicle_type_id: vehicleTypeId,
      },
      attributes: [
         "vehicle_type_id",
         "vehicle_type_name", 
         "vehicle_type_description",
      ],
      include: [
         {
            model: db.Vehicle,
            as: "vehicleType_to_vehicle",
            attributes: [
               "vehicle_id",
               "vehicle_code",
               "vehicle_license_plate",
               "vehicle_model",
               "vehicle_brand",
               "vehicle_capacity"
            ]
         }
      ],
      nest: true,
      raw: true,
   })
      .then((vehicleType) => {
         if (!vehicleType) {
            throw new __RESPONSE.NotFoundError({
               message: "Resource not found - vehicle Type not found !",
               suggestion: "Please check your request",
               request: req,
            });
         }
         return {vehicleType};
      })
      .catch((error) => {
         if (error instanceof __RESPONSE.NotFoundError) {
            throw error;
         }
         throw new __RESPONSE.BadRequestError({
            message: "Error in getting office by id " + error.message,
            suggestion: "Please check your request",
            request: req,
         });
      });
};

const createVehicleType = async (req) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      throw new __RESPONSE.BadRequestError({
         message: "Validation failed " + errors.array()[0]?.msg + " !",
         suggestion: "Please provide the correct data",
         request: req,
      });
   }
   const { name, description} = req.body;
   return await db.VehicleType.create({
      vehicle_type_name: name,
      vehicle_type_description: description,
   
   })
      .then((vehicleType) => {
         if (!vehicleType) {
            throw new __RESPONSE.BadRequestError({
               message: "Error in creating vehicle Type",
               suggestion: "Please check your request",
               request: req,
            });
         }
         return {vehicleType};
      })
      .catch((error) => {
         if (error.original?.code === "ER_DUP_ENTRY") {
            throw new __RESPONSE.BadRequestError({
               message: "vehicle Type already exists " + error.original.sqlMessage,
               suggestion: "Please check your request",
               request: req,
            });
         }
         throw new __RESPONSE.BadRequestError({
            message: "Error in creating vehicle Type ",
            suggestion: "Please check your request",
            request: req,
         });
      });
};

const updateVehicleType = async (req) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      throw new __RESPONSE.BadRequestError({
         message: "Validation failed " + errors.array()[0]?.msg + " !",
         suggestion: "Please provide the correct data",
         request: req,
      });
   }
   const {vehicleTypeId, name, description} = req.body;
   const vehicleType = await db.VehicleType.findOne({
      where: {
         vehicle_type_id: vehicleTypeId,
      },
      attributes: [
        "vehicle_type_id",
         "vehicle_type_name", 
         "vehicle_type_description",
      ],
      include: [
         {
            model: db.Vehicle,
            as: "vehicleType_to_vehicle",
            attributes: [
               "vehicle_id",
               "vehicle_code",
               "vehicle_license_plate",
               "vehicle_model",
               "vehicle_brand",
               "vehicle_capacity"
            ]
         }
      ],
   });
   if (!vehicleType) {
      throw new __RESPONSE.NotFoundError({
         message: "Resource not found - Vehicle Type not found !",
         suggestion: "Please check your request",
         request: req,
      });
   }
   return await vehicleType
      .update({
         vehicle_type_name: name,
         vehicle_type_description: description,
      })
      .then((vehicleType) => {
         if (!vehicleType) {
            throw new __RESPONSE.BadRequestError({
               message: "Error in updating vehicle Type",
               suggestion: "Please check your request",
               request: req,
            });
         }
         return {vehicleType};
      })
      .catch((error) => {
         if (error.original?.code === "ER_DUP_ENTRY") {
            throw new __RESPONSE.BadRequestError({
               message: "vehicle Type already exists " + error.original.sqlMessage,
               suggestion: "Please check your request",
               request: req,
            });
         }
         throw new __RESPONSE.BadRequestError({
            message: "Error in updating vehicle type",
            suggestion: "Please check your request",
            request: req,
         });
      });
};

const deleteVehicleType = async (req) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      throw new __RESPONSE.BadRequestError({
         message: "Validation failed " + errors.array()[0]?.msg + " !",
         suggestion: "Please provide the correct data",
         request: req,
      });
   }
   const {vehicleTypeId} = req.query;
   const vehicle = await db.VehicleType.findOne({
      where: {
         vehicle_type_id: vehicleTypeId,
      },
   });
   if (!vehicle) {
      throw new __RESPONSE.NotFoundError({
         message: "Resource not found - vehicle type not found !",
         suggestion: "Please check your request",
         request: req,
      });
   }
   return await vehicle
      .destroy()
      .then((vehicle) => {
         if (!vehicle) {
            throw new __RESPONSE.NotFoundError({
               message: "Resource not found - Vehicle type not found !",
               suggestion: "Please check your request",
               request: req,
            });
         }
         return {vehicle};
      })
      .catch((error) => {
         if (error.original && error.original.code === "ER_ROW_IS_REFERENCED_2") {
            throw new __RESPONSE.BadRequestError({
               message: "Vehicle is referenced by other tables",
               suggestion: "Please check your request",
               request: req,
            });
         }
         throw new __RESPONSE.BadRequestError({
            message: "Error in deleting vehicle type",
            suggestion: "Please check your request",
            request: req,
         });
      });
};

const findAllDeletedVehicleType = async (req) => {
   // Sửa từ db.vehicleType thành db.VehicleType
   return await db.VehicleType.findAll({
      attributes: [
         "vehicle_type_id",
         "vehicle_type_name", 
         "vehicle_type_description",
      ],
      where: {
         deleted_at: {[db.Sequelize.Op.ne]: null},
      },
      order: [["deleted_at", "DESC"]],
      include: [
         {
            model: db.Vehicle,
            as: "vehicleType_to_vehicle",
            attributes: [
               "vehicle_id",
               "vehicle_code",
               "vehicle_license_plate",
               "vehicle_model",
               "vehicle_brand",
               "vehicle_capacity"
            ]
         }
      ],
      paranoid: false,
      nest: true,
      raw: true,
   })
      .then((vehicles) => {
         if (!vehicles?.length) {  
            throw new __RESPONSE.NotFoundError({
               message: "Resource not found - List of all deleted vehicle type not found !",
               suggestion: "Please check your request",
               request: req,
            });
         }
         return {vehicles, total: vehicles.length};
      })
      .catch((error) => {
         // Thêm error message gốc vào thông báo lỗi
         throw new __RESPONSE.BadRequestError({
            message: `Error in finding all deleted type vehicles: ${error.message}`,
            suggestion: "Please check your request",
            request: req,
         });
      });
};

module.exports = {
   getAllVehicleTypes,
   getVehicleTypeById,
   createVehicleType,
   updateVehicleType,
   deleteVehicleType,
   findAllDeletedVehicleType,
};
