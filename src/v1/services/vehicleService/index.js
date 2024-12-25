"use strict";
const __RESPONSE = require("../../core");
const {validationResult} = require("express-validator");
const db = require("../../models");
const c = require("config");

const getAllVehicles = async (req) => {
   return await db.Vehicle.findAll({
      attributes: [
         ["vehicle_id", "id"],
         ["vehicle_code", "code"],
         ["vehicle_license_plate", "license_plate"],
         ["vehicle_model", "model"],
         ["vehicle_brand", "brand"],
         ["vehicle_capacity", "capacity"],
         ["vehicle_manufacture_year", "manufacture_year"],
         ["vehicle_color", "color"],
         ["vehicle_description", "description"],
         ["is_locked", "isLocked"],
         ["last_lock_at", "lastLockAt"],
         ["vehicle_image", "images"],
         ["office_id", "officeId"],
      ],
      include: [
         {
            model: db.MapVehicleLayout,
            as: "vehicle_belongto_mapVehicleLayout",
            attributes: [
               ["map_vehicle_layout_id", "id"],
               ["layout_name", "name"],
            ],
            include: [
               {
                  model: db.VehicleType,
                  as: "mapVehicleLayout_belongto_vehicleType",
                  attributes: [
                     ["vehicle_type_id", "id"],
                     ["vehicle_type_name", "name"],
                     ["vehicle_type_description", "description"],
                  ],
               },
            ],
         },
      ],
      where: {
         deleted_at: null,
      },
      nest: true,
      raw: true,
   })
      .then((vehicles) => {
         if (!vehicles || vehicles.length == 0) {
            throw new __RESPONSE.NotFoundError({
               message: "Không tìm thấy xe nào!",
               suggestion: "Vui lòng kiểm tra lại yêu cầu",
               request: req,
            });
         }

         const formattedVehicles = vehicles.map((vehicle) => ({
            ...vehicle,
            mapVehicleLayout: vehicle.vehicle_belongto_mapVehicleLayout || "",
            vehicleType: vehicle.vehicle_belongto_mapVehicleLayout.mapVehicleLayout_belongto_vehicleType || "",
         }));

         return {
            vehicles: formattedVehicles,
            total: vehicles.length,
         };
      })
      .catch((error) => {
         throw new __RESPONSE.BadRequestError({
            message: "Lỗi khi lấy danh sách xe " + error.message,
            suggestion: "Vui lòng kiểm tra lại yêu cầu",
            request: req,
         });
      });
};

const getVehicleType = async (req) => {
   return await db.VehicleType.findAll()
      .then((vehicleTypes) => {
         if (!vehicleTypes || vehicleTypes.length == 0) {
            throw new __RESPONSE.NotFoundError({
               message: "Không tìm thấy loại xe nào!",
               suggestion: "Vui lòng kiểm tra lại yêu cầu",
               request: req,
            });
         }
         return {
            vehicleTypes: vehicleTypes,
            total: vehicleTypes.length,
         };
      })
      .catch((error) => {
         throw new __RESPONSE.BadRequestError({
            message: "Lỗi khi lấy danh sách loại xe " + error.message,
            suggestion: "Vui lòng kiểm tra lại yêu cầu",
            request: req,
         });
      });
};

const getLayoutVehicle = async (req) => {
   return await db.MapVehicleLayout.findAll({
      include: [
         {
            model: db.VehicleType,
            as: "mapVehicleLayout_belongto_vehicleType",
         },
      ],
   })
      .then((mapVehicleLayouts) => {
         if (!mapVehicleLayouts || mapVehicleLayouts.length == 0) {
            throw new __RESPONSE.NotFoundError({
               message: "Không tìm thấy bản đồ xe nào!",
               suggestion: "Vui lòng kiểm tra lại yêu cầu",
               request: req,
            });
         }
         return {
            mapVehicleLayouts: mapVehicleLayouts,
            total: mapVehicleLayouts.length,
         };
      })
      .catch((error) => {
         throw new __RESPONSE.BadRequestError({
            message: "Lỗi khi lấy danh sách bản đồ xe " + error.message,
            suggestion: "Vui lòng kiểm tra lại yêu cầu",
            request: req,
         });
      });
};

const createVehicle = async (req) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      throw new __RESPONSE.BadRequestError({
         message: "Validation failed " + errors.array()[0]?.msg + " !",
         suggestion: "Please provide the correct data",
         request: req,
      });
   }
   const {
      vehicle_code,
      vehicle_license_plate,
      vehicle_model,
      vehicle_brand,
      vehicle_capacity,
      vehicle_manufacture_year,
      vehicle_image,
      vehicle_color,
      vehicle_description,
      is_locked,
      last_lock_at,
      map_vehicle_layout_id,
      office_id,
   } = req.body;

   await db.Vehicle.create({
      vehicle_code: "VEHICLE-" + Math.random().toString(36).substring(2, 15).toUpperCase(),
      vehicle_license_plate,
      vehicle_model,
      vehicle_brand,
      vehicle_capacity,
      vehicle_manufacture_year,
      vehicle_image,
      vehicle_color,
      vehicle_description,
      is_locked,
      last_lock_at,
      map_vehicle_layout_id,
      office_id,
   })
      .then((vehicle) => {
         if (!vehicle) {
            throw new __RESPONSE.BadRequestError({
               message: "Lỗi khi tạo xe!",
               suggestion: "Vui lòng kiểm tra lại yêu cầu",
               request: req,
            });
         }
         return {
            message: "Xe đã được tạo thành công!",
            suggestion: "Vui lòng kiểm tra lại yêu cầu",
            request: req,
         };
      })
      .catch((error) => {
         if (error.original?.code === "ER_DUP_ENTRY") {
            const duplicateField = error.original.sqlMessage.includes("vehicle_code")
               ? "mã xe"
               : error.original.sqlMessage.includes("vehicle_license_plate")
               ? "biển số xe"
               : error.original.sqlMessage.includes("vehicle_model")
               ? "model xe"
               : "dữ liệu";

            throw new __RESPONSE.BadRequestError({
               message: `Đã tồn tại ${duplicateField} này trong hệ thống`,
               suggestion: `Vui lòng kiểm tra lại ${duplicateField} và thử lại`,
               request: req,
            });
         }
         throw new __RESPONSE.BadRequestError({
            message: "Lỗi khi tạo xe " + error.message,
            suggestion: "Vui lòng kiểm tra lại yêu cầu",
            request: req,
         });
      });
};

const updateVehicle = async (req) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      throw new __RESPONSE.BadRequestError({
         message: "Validation failed " + errors.array()[0]?.msg + " !",
         suggestion: "Please provide the correct data",
         request: req,
      });
   }
   const {
      vehicle_id,
      vehicle_code,
      vehicle_license_plate,
      vehicle_model,
      vehicle_brand,
      vehicle_capacity,
      vehicle_manufacture_year,
      vehicle_image,
      vehicle_color,
      vehicle_description,
      is_locked,
      last_lock_at,
      map_vehicle_layout_id,
      office_id,
   } = req.body;

   return await db.Vehicle.update(
      {
         vehicle_code,
         vehicle_license_plate,
         vehicle_model,
         vehicle_brand,
         vehicle_capacity,
         vehicle_manufacture_year,
         vehicle_image,
         vehicle_color,
         vehicle_description,
         is_locked,
         last_lock_at: is_locked ? new Date() : null,
         map_vehicle_layout_id,
         office_id,
      },
      {
         where: {
            vehicle_id,
         },
      }
   )
      .then((affectedCount) => {
         if (!affectedCount) {
            throw new __RESPONSE.NotFoundError({
               message: "Không tìm thấy xe để cập nhật!",
               suggestion: "Vui lòng kiểm tra lại id xe",
            });
         }
         return {
            message: "Cập nhật xe thành công!",
            suggestion: "Xe đã được cập nhật",
         };
      })
      .catch((error) => {
         console.log(error);
         if (error.original?.code === "ER_DUP_ENTRY") {
            const duplicateField = error.original.sqlMessage.includes("vehicle_code")
               ? "mã xe"
               : error.original.sqlMessage.includes("vehicle_license_plate")
               ? "biển số xe"
               : "dữ liệu";

            throw new __RESPONSE.BadRequestError({
               message: `Đã tồn tại ${duplicateField} này trong hệ thống`,
               suggestion: `Vui lòng kiểm tra lại ${duplicateField} và thử lại`,
            });
         }
         throw new __RESPONSE.BadRequestError({
            message: "Lỗi khi cập nhật xe: " + error.message,
            suggestion: "Vui lòng kiểm tra lại yêu cầu",
         });
      });
};

const deleteVehicle = async (req) => {
   const {vehicle_id} = req.params;

   if (!vehicle_id) {
      throw new __RESPONSE.BadRequestError({
         message: "Vui lòng nhập id xe",
         suggestion: "Vui lòng kiểm tra lại yêu cầu",
         request: req,
      });
   }

   const vehicle = await db.Vehicle.findOne({
      where: {
         vehicle_id,
      },
   });

   if (!vehicle) {
      throw new __RESPONSE.NotFoundError({
         message: "Không tìm thấy xe để xóa!",
         suggestion: "Vui lòng kiểm tra lại id xe",
         request: req,
      });
   }

   await db.Vehicle.destroy({
      where: {
         vehicle_id,
      },
   })
      .then((affectedCount) => {
         if (affectedCount === 0) {
            throw new __RESPONSE.NotFoundError({
               message: "Không tìm thấy xe để xóa!",
               suggestion: "Vui lòng kiểm tra lại id xe",
               request: req,
            });
         }
         return {
            message: "Xóa xe thành công!",
            suggestion: "Xe đã được xóa khỏi hệ thống",
            request: req,
         };
      })
      .catch((error) => {
         throw new __RESPONSE.BadRequestError({
            message: "Lỗi khi xóa xe: " + error.message,
            suggestion: "Vui lòng kiểm tra lại yêu cầu",
         });
      });
};

module.exports = {
   getAllVehicles,
   updateVehicle,
   deleteVehicle,
   createVehicle,
   getLayoutVehicle,
   getVehicleType,
};
