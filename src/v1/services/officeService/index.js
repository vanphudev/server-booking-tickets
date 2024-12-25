"use strict";
const __RESPONSE = require("../../core");
const {validationResult} = require("express-validator");
const {handleUpload, deleteImage} = require("../../utils/uploadImages");
const db = require("../../models");

const getAllOffices = async (req) => {
   return await db.Office.findAll({
      attributes: [
         "office_id",
         "office_name",
         "office_address",
         "office_phone",
         "office_fax",
         "office_description",
         "office_latitude",
         "office_longitude",
         "office_map_url",
         "is_locked",
         "last_lock_at",
         "created_at",
         "updated_at",
      ],
      include: [
         {
            model: db.OfficeImage,
            as: "office_to_officeImage",
            attributes: ["office_image_id", "office_image_url", "office_image_description"],
         },
         {
            model: db.Ward,
            as: "office_belongto_ward",
            attributes: ["ward_id", "ward_name"],
            include: [
               {
                  model: db.District,
                  as: "ward_belongto_district",
                  attributes: ["district_id", "district_name"],
                  include: [
                     {
                        model: db.Province,
                        as: "district_belongto_province",
                        attributes: ["province_id", "province_name"],
                     },
                  ],
               },
            ],
         },
      ],
   })
      .then((offices) => {
         if (!offices || offices.length === 0) {
            throw new __RESPONSE.NotFoundError({
               message: "Resource not found - Offices not found !",
               suggestion: "Please check your request",
               request: req,
            });
         }
         return {
            offices,
            total: offices.length,
         };
      })
      .catch((error) => {
         throw new __RESPONSE.BadRequestError({
            message: "Error in getting all offices" + error.message,
            suggestion: "Please check your request",
            request: req,
         });
      });
};

const getOfficeById = async (req) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      throw new __RESPONSE.BadRequestError({
         message: "Validation failed " + errors.array()[0]?.msg + " !",
         suggestion: "Please provide the correct data",
         request: req,
      });
   }
   const {officeId} = req.query;
   return await db.Office.findOne({
      where: {
         office_id: officeId,
      },
      attributes: [
         "office_id",
         "office_name",
         "office_address",
         "office_phone",
         "office_fax",
         "office_description",
         "office_latitude",
         "office_longitude",
         "office_map_url",
      ],
      include: [
         {
            model: db.OfficeImage,
            as: "office_to_officeImage",
            attributes: ["office_image_id", "office_image_url", "office_image_description"],
         },
      ],
      nest: true,
      raw: true,
      attributes: [
         "office_id",
         "office_name",
         "office_address",
         "office_phone",
         "office_fax",
         "office_description",
         "office_latitude",
         "office_longitude",
         "office_map_url",
      ],
      include: [
         {
            model: db.OfficeImage,
            as: "office_to_officeImage",
            attributes: ["office_image_id", "office_image_url", "office_image_description"],
         },
      ],
      nest: true,
      raw: true,
   })
      .then((office) => {
         if (!office) {
            throw new __RESPONSE.NotFoundError({
               message: "Resource not found - Offices not found !",
               suggestion: "Please check your request",
               request: req,
            });
         }
         return {office};
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

const createOffice = async (req) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      throw new __RESPONSE.BadRequestError({
         message: "Validation failed " + errors.array()[0]?.msg + " !",
         suggestion: "Please provide the correct data",
         request: req,
      });
   }
   const {name, address, phone, fax, description, latitude, longitude, map_url, isLocked, lastLockAt, wardId} =
      req.body;
   return await db.Office.create({
      office_name: name,
      office_address: address,
      office_phone: phone,
      office_fax: fax,
      office_description: description,
      office_latitude: latitude,
      office_longitude: longitude,
      office_map_url: map_url,
      ward_id: wardId,
      is_locked: isLocked && isLocked == 1 ? 1 : 0,
      last_lock_at: isLocked && isLocked == 1 ? new Date() : null,
   })
      .then((office) => {
         if (!office) {
            throw new __RESPONSE.BadRequestError({
               message: "Error in creating office",
               suggestion: "Please check your request",
               request: req,
            });
         }
         return {office};
      })
      .catch((error) => {
         if (error.original?.code === "ER_DUP_ENTRY") {
            const duplicateField = error.original.sqlMessage.includes("office_name")
               ? "tên văn phòng"
               : error.original.sqlMessage.includes("office_phone")
               ? "số điện thoại văn phòng"
               : error.original.sqlMessage.includes("office_fax")
               ? "số fax văn phòng"
               : "dữ liệu";

            throw new __RESPONSE.BadRequestError({
               message: `Đã tồn tại ${duplicateField} này trong hệ thống`,
               suggestion: `Vui lòng kiểm tra lại ${duplicateField} và thử lại`,
               request: req,
            });
         }
         throw new __RESPONSE.BadRequestError({
            message: "Error in creating office" + error.message,
            suggestion: "Please check your request",
            request: req,
         });
      });
};

const updateOffice = async (req) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      throw new __RESPONSE.BadRequestError({
         message: "Validation failed " + errors.array()[0]?.msg + " !",
         suggestion: "Please provide the correct data",
         request: req,
      });
   }
   const {
      officeId,
      name,
      address,
      phone,
      fax,
      description,
      latitude,
      longitude,
      map_url,
      isLocked,
      lastLockAt,
      wardId,
   } = req.body;

   const office = await db.Office.findOne({
      where: {
         office_id: officeId,
      },
   });

   if (!office) {
      throw new __RESPONSE.NotFoundError({
         message: "Resource not found - Office not found !",
         suggestion: "Please check your request",
         request: req,
      });
   }

   return await office
      .update({
         office_name: name,
         office_address: address,
         office_phone: phone,
         office_fax: fax,
         office_description: description,
         office_latitude: latitude,
         office_longitude: longitude,
         office_map_url: map_url,
         ward_id: wardId,
         is_locked: isLocked && isLocked == 1 ? 1 : 0,
         last_lock_at: isLocked && isLocked == 1 ? new Date() : null,
      })
      .then((office) => {
         if (!office) {
            throw new __RESPONSE.BadRequestError({
               message: "Error in updating office",
               suggestion: "Please check your request",
               request: req,
            });
         }
         return {office};
      })
      .catch((error) => {
         if (error.original?.code === "ER_DUP_ENTRY") {
            const duplicateField = error.original.sqlMessage.includes("office_name")
               ? "tên văn phòng"
               : error.original.sqlMessage.includes("office_phone")
               ? "số điện thoại văn phòng"
               : error.original.sqlMessage.includes("office_fax")
               ? "số fax văn phòng"
               : "dữ liệu";

            throw new __RESPONSE.BadRequestError({
               message: `Đã tồn tại ${duplicateField} này trong hệ thống`,
               suggestion: `Vui lòng kiểm tra lại ${duplicateField} và thử lại`,
               request: req,
            });
         }
         throw new __RESPONSE.BadRequestError({
            message: "Error in updating office",
            suggestion: "Please check your request",
            request: req,
         });
      });
};

const deleteOffice = async (req) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      throw new __RESPONSE.BadRequestError({
         message: "Validation failed " + errors.array()[0]?.msg + " !",
         suggestion: "Please provide the correct data",
         request: req,
      });
   }

   const {officeId} = req.params;
   const office = await db.Office.findOne({
      where: {
         office_id: officeId,
      },
   });

   if (!office) {
      throw new __RESPONSE.NotFoundError({
         message: "Resource not found - Office not found !",
         suggestion: "Please check your request",
         request: req,
      });
   }

   const officeImages = await db.OfficeImage.findAll({
      where: {
         office_id: officeId,
      },
   });

   try {
      if (officeImages && officeImages.length > 0) {
         officeImages.forEach(async (image) => {
            await image.destroy();
            await deleteImage(image.office_image_public_id);
         });
      }
   } catch (error) {
      throw new __RESPONSE.BadRequestError({
         message: "Error in deleting office images",
         suggestion: "Please check your request",
         request: req,
      });
   }

   return await office
      .destroy()
      .then((office) => {
         if (!office) {
            throw new __RESPONSE.NotFoundError({
               message: "Resource not found - Offices not found !",
               suggestion: "Please check your request",
               request: req,
            });
         }
         return {office};
      })
      .catch((error) => {
         if (error.original && error.original.code === "ER_ROW_IS_REFERENCED_2") {
            throw new __RESPONSE.BadRequestError({
               message: "Office is referenced by other tables",
               suggestion: "Please check your request",
               request: req,
            });
         }
         throw new __RESPONSE.BadRequestError({
            message: "Error in deleting office",
            suggestion: "Please check your request",
            request: req,
         });
      });
};

const findAllDeletedOffice = async (req) => {
   return await db.Office.findAll({
      attributes: [
         "office_id",
         "office_name",
         "office_address",
         "office_phone",
         "office_fax",
         "office_description",
         "office_latitude",
         "office_longitude",
         "office_map_url",
         "deleted_at",
      ],
      where: {
         deleted_at: {[db.Sequelize.Op.ne]: null},
      },
      order: [["deleted_at", "DESC"]],
      include: [
         {
            model: db.OfficeImage,
            as: "office_to_officeImage",
            attributes: ["office_image_id", "office_image_url", "office_image_description"],
         },
      ],
      paranoid: false,
      nest: true,
      raw: true,
   })
      .then((offices) => {
         if (!offices) {
            throw new __RESPONSE.NotFoundError({
               message: "Resource not found - List of all deleted offices not found !",
               suggestion: "Please check your request",
               request: req,
            });
         }
         return {offices, total: offices.length};
      })
      .catch((error) => {
         throw new __RESPONSE.BadRequestError({
            message: "Error in finding all deleted offices",
            suggestion: "Please check your request",
            request: req,
         });
      });
};

module.exports = {
   getAllOffices,
   getOfficeById,
   createOffice,
   updateOffice,
   deleteOffice,
   findAllDeletedOffice,
};
