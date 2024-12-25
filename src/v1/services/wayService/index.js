"use strict";
const __RESPONSE = require("../../core");
const { validationResult } = require("express-validator");
const db = require("../../models");

const getAllWays = async (req) => {
   return await db.Way.findAll({
      include: [
         {
            model: db.PickupPoint,
            as: "way_to_pickupPoint",
            foreignKey: "pickup_point_way_id",
            include: [
               {
                  model: db.Office,
                  as: "pickupPoint_belongto_office",
               },
            ],
         },
      ],
      attributes: ["way_id", "way_name", "way_description"],
   })
      .then((ways) => {
         if (!ways) {
            throw new __RESPONSE.NotFoundError({
               message: "Resource not found - Ways not found !",
               suggestion: "Please check your request",
               request: req,
            });
         }
         return {
            ways: ways,
            total: ways.length,
         };
      })
      .catch((error) => {
         throw new __RESPONSE.BadRequestError({
            message: "Error in getting all ways " + error.message,
            suggestion: "Please check your request",
            request: req,
         });
      });
};

const getWayById = async (req) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      throw new __RESPONSE.BadRequestError({
         message: "Xác thực dữ liệu thất bại: " + errors.array()[0]?.msg + " !",
         suggestion: "Vui lòng cung cấp dữ liệu chính xác",
         request: req,
      });
   }

   const { wayId } = req.query;
   return await db.Way.findAll({
      where: {
         way_id: wayId,
      },
      attributes: ["way_id", "way_name", "way_description"],
      include: [
         {
            model: db.Office,
            as: "way_to_office",
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
            through: {
               model: db.PickupPoint,
               as: "PickupPoint",
               attributes: ["pickup_point_time", "pickup_point_kind", "pickup_point_description", "point_kind_name"],
            },
         },
      ],
      nest: true,
      raw: true,
   })
      .then((way) => {
         if (!way || way.length === 0) {
            throw new __RESPONSE.NotFoundError({
               message: "Resource not found - Way not found !",
               suggestion: "Please check your request",
               request: req,
            });
         }
         const groupedWays = way.reduce((acc, current) => {
            const wayId = current.way_id;
            if (!acc[wayId]) {
               acc[wayId] = {
                  way_id: current.way_id,
                  way_name: current.way_name,
                  way_description: current.way_description,
                  offices: [],
               };
            }
            acc[wayId].offices.push(current.way_to_office);
            return acc;
         }, {});
         return {
            way: Object.values(groupedWays),
            total: way.length,
         };
      })
      .catch((error) => {
         if (error instanceof __RESPONSE.NotFoundError) {
            throw error;
         }
         throw new __RESPONSE.BadRequestError({
            message: "Error in getting way by id " + error.message,
            suggestion: "Please check your request",
            request: req,
         });
      });
}; 

const createWay = async (req) => {
   const { way_name, way_description, list_pickup_point } = req.body;

   // Validate required fields
   if (!way_name || typeof way_name !== 'string' || way_name.trim().length === 0) {
      throw new __RESPONSE.BadRequestError({
         message: "Tên tuyến đường không được để trống và phải là chuỗi ký tự",
         suggestion: "Vui lòng nhập tên tuyến đường hợp lệ",
         request: req,
      });
   }

   // Validate list_pickup_point
   if (!Array.isArray(list_pickup_point) || list_pickup_point.length === 0) {
      throw new __RESPONSE.BadRequestError({
         message: "Danh sách điểm đón không được để trống",
         suggestion: "Vui lòng cung cấp ít nhất một điểm đón",
         request: req,
      });
   }

   // Validate each pickup point
   list_pickup_point.forEach((point, index) => {
      if (!point.office_id || !Number.isInteger(point.office_id)) {
         throw new __RESPONSE.BadRequestError({
            message: `Invalid office_id at pickup point index ${index}`,
            suggestion: "Vui lòng cung cấp mã số văn phòng hợp lệ cho mỗi điểm đón",
            request: req,
         });
      }


      if (!['-1', '0', '1'].includes(point.pickup_point_kind?.toString())) {
         throw new __RESPONSE.BadRequestError({
            message: `Invalid pickup_point_kind at pickup point index ${index}. Must be -1, 0, or 1`,
            suggestion: "Vui lòng cung cấp loại điểm hợp lệ",
            request: req,
         });
      }
   });

   // Validate that there is exactly one start point (-1) and one end point (1)
   const startPoints = list_pickup_point.filter(p => p.pickup_point_kind === -1);
   const endPoints = list_pickup_point.filter(p => p.pickup_point_kind === 1);

   if (startPoints.length !== 1 || endPoints.length !== 1) {
      throw new __RESPONSE.BadRequestError({
         message: "There must be exactly one start point (-1) and one end point (1)",
         suggestion: "Vui lòng cung cấp loại điểm hợp lệ",
         request: req,
      });
   }

   try {
      // Tạo transaction để đảm bảo tính nhất quán của dữ liệu
      const result = await db.sequelize.transaction(async (t) => {
         // Tạo way mới
         const way = await db.Way.create({
            way_name,
            way_description
         }, { transaction: t });

         if (!way) {
            throw new __RESPONSE.BadRequestError({
               message: "Error in creating way",
               suggestion: "Please check your request",
               request: req,
            });
         }

         // Tạo các pickup points cho way
         if (list_pickup_point && list_pickup_point.length > 0) {
            const pickupPointsData = list_pickup_point.map(point => ({
               pickup_point_way_id: way.way_id,
               pickup_point_office_id: point.office_id,
               pickup_point_name: point.pickup_point_name,
               pickup_point_time: point.pickup_point_time,
               pickup_point_description: point.pickup_point_description,
               pickup_point_kind: point.pickup_point_kind,
               point_kind_name: getPointKindName(point.pickup_point_kind) // Hàm helper để lấy tên loại điểm
            }));

            await db.PickupPoint.bulkCreate(pickupPointsData, { transaction: t });
         }

         // Lấy way vừa tạo kèm theo pickup points
         const wayWithPickupPoints = await db.Way.findOne({
            where: { way_id: way.way_id },
            include: [{
               model: db.PickupPoint,
               as: "way_to_pickupPoint",
               include: [{
                  model: db.Office,
                  as: "pickupPoint_belongto_office"
               }]
            }],
            transaction: t
         });

         return {
            way: wayWithPickupPoints,
         };
      });

      return { way: result };

   } catch (error) {
      if (error instanceof __RESPONSE.BadRequestError) {
         throw error;
      }
      if (error.original?.code === "ER_DUP_ENTRY") {
         const field = error.fields || {};
         let errorMessage = "Đã tồn tại ";
         if (field.way_name) {
            errorMessage += field.way_name + "tên tuyến đường này trong hệ thống";
         } else {
            errorMessage += "thông tin này trong hệ thống";
         }
         throw new __RESPONSE.BadRequestError({
            message: errorMessage,
            suggestion: "Vui lòng thử lại với thông tin khác",
            request: req,
            field: field,
         });
      }
      throw new __RESPONSE.BadRequestError({
         message: "Error in creating way: " + error.message,
         suggestion: "Please check your request",
         request: req,
      });
   }
};

const getPointKindName = (pointKind) => {
   switch (pointKind) {
      case -1:
         return "Điểm xuất phát của tuyến đường";
      case 0:
         return "Điểm trung gian của tuyến đường";
      case 1:
         return "Điểm kết thúc của tuyến đường";
      default:
         return "Không xác định loại điểm";
   }
};

const updateWay = async (req) => {
   const { way_id, way_name, way_description, list_pickup_point } = req.body;

   // Validate required fields
   if (!way_name || typeof way_name !== 'string' || way_name.trim().length === 0) {
      throw new __RESPONSE.BadRequestError({
         message: "Tên tuyến đường không được để trống và phải là chuỗi ký tự",
         suggestion: "Vui lòng nhập tên tuyến đường hợp lệ",
         request: req,
      });
   }

   // Validate list_pickup_point
   if (!Array.isArray(list_pickup_point) || list_pickup_point.length === 0) {
      throw new __RESPONSE.BadRequestError({
         message: "Danh sách điểm đón không được để trống",
         suggestion: "Vui lòng cung cấp ít nhất một điểm đón",
         request: req,
      });
   }

   // Validate each pickup point
   list_pickup_point.forEach((point, index) => {
      if (!point.office_id || !Number.isInteger(point.office_id)) {
         throw new __RESPONSE.BadRequestError({
            message: `Mã văn phòng không hợp lệ tại điểm đón thứ ${index + 1}`,
            suggestion: "Vui lòng cung cấp mã văn phòng hợp lệ cho mỗi điểm đón",
            request: req,
         });
      }

      if (!['-1', '0', '1'].includes(point.pickup_point_kind?.toString())) {
         throw new __RESPONSE.BadRequestError({
            message: `Loại điểm đón không hợp lệ tại điểm thứ ${index + 1}`,
            suggestion: "Vui lòng chọn loại điểm đón hợp lệ (-1: điểm đầu, 0: điểm trung gian, 1: điểm cuối)",
            request: req,
         });
      }
   });

   // Validate start and end points
   const startPoints = list_pickup_point.filter(p => p.pickup_point_kind === -1);
   const endPoints = list_pickup_point.filter(p => p.pickup_point_kind === 1);

   if (startPoints.length !== 1 || endPoints.length !== 1) {
      throw new __RESPONSE.BadRequestError({
         message: "Phải có đúng một điểm xuất phát (-1) và một điểm kết thúc (1)",
         suggestion: "Vui lòng kiểm tra lại các điểm đón trong tuyến đường",
         request: req,
      });
   }

   try {
      // Sử dụng transaction để đảm bảo tính nhất quán
      const result = await db.sequelize.transaction(async (t) => {
         // Kiểm tra way tồn tại
         const way = await db.Way.findOne({
            where: { way_id: way_id },
            transaction: t
         });

         if (!way) {
            throw new __RESPONSE.NotFoundError({
               message: "Không tìm thấy tuyến đường này",
               suggestion: "Vui lòng kiểm tra lại mã tuyến đường",
               request: req,
            });
         }

         // Cập nhật thông tin way
         await way.update({
            way_name,
            way_description
         }, { transaction: t });

         // Xóa tất cả pickup points cũ
         await db.PickupPoint.destroy({
            where: { pickup_point_way_id: way_id },
            transaction: t
         });

         // Tạo pickup points mới
         const pickupPointsData = list_pickup_point.map(point => ({
            pickup_point_way_id: way_id,
            pickup_point_office_id: point.office_id,
            pickup_point_name: point.pickup_point_name,
            pickup_point_time: point.pickup_point_time,
            pickup_point_description: point.pickup_point_description,
            pickup_point_kind: point.pickup_point_kind,
            point_kind_name: getPointKindName(point.pickup_point_kind)
         }));

         await db.PickupPoint.bulkCreate(pickupPointsData, { transaction: t });

         // Lấy way đã cập nhật kèm theo pickup points
         const updatedWay = await db.Way.findOne({
            where: { way_id: way_id },
            include: [{
               model: db.PickupPoint,
               as: "way_to_pickupPoint",
               include: [{
                  model: db.Office,
                  as: "pickupPoint_belongto_office"
               }]
            }],
            transaction: t
         });

         return updatedWay;
      });

      return { way: result };

   } catch (error) {
      if (error instanceof __RESPONSE.NotFoundError) {
         throw error;
      }
      if (error.original?.code === "ER_DUP_ENTRY") {
         throw new __RESPONSE.BadRequestError({
            message: "Đã tồn tại tuyến đường với tên này trong hệ thống",
            suggestion: "Vui lòng thử lại với tên khác",
            request: req,
         });
      }
      throw new __RESPONSE.BadRequestError({
         message: "Lỗi khi cập nhật tuyến đường: " + error.message,
         suggestion: "Vui lòng kiểm tra lại dữ liệu và thử lại",
         request: req,
      });
   }
};

const deleteWay = async (req) => {
   const { wayId } = req.query;
   if (!wayId) {
      throw new __RESPONSE.BadRequestError({
         message: "Mã tuyến đường không được để trống",
         suggestion: "Vui lòng cung cấp mã tuyến đường hợp lệ",
         request: req,
      });
   }

   try {
      // Sử dụng transaction để đảm bảo tính nhất quán
      const result = await db.sequelize.transaction(async (t) => {
         // Kiểm tra way tồn tại
         const way = await db.Way.findOne({
            where: { way_id: wayId },
            include: [{
               model: db.PickupPoint,
               as: "way_to_pickupPoint"
            }],
            transaction: t
         });

         if (!way) {
            throw new __RESPONSE.NotFoundError({
               message: "Không tìm thấy tuyến đường này trong hệ thống",
               suggestion: "Vui lòng kiểm tra lại mã tuyến đường",
               request: req,
            });
         }

         // Xóa tất cả pickup points trước
         await db.PickupPoint.destroy({
            where: { pickup_point_way_id: wayId },
            transaction: t
         });

         // Sau đó xóa way
         await way.destroy({ transaction: t });

         return way;
      });

      return { way: result };

   } catch (error) {
      if (error instanceof __RESPONSE.NotFoundError) {
         throw error;
      }
      if (error.original?.code === "ER_ROW_IS_REFERENCED_2") {
         throw new __RESPONSE.BadRequestError({
            message: "Không thể xóa tuyến đường này vì đang được sử dụng bởi các bảng khác",
            suggestion: "Vui lòng kiểm tra và gỡ bỏ các liên kết trước khi xóa",
            request: req,
         });
      }
      throw new __RESPONSE.BadRequestError({
         message: "Lỗi khi xóa tuyến đường: " + error.message,
         suggestion: "Vui lòng thử lại hoặc liên hệ quản trị viên",
         request: req,
      });
   }
};


module.exports = {
   getAllWays,
   getWayById,
   createWay,
   updateWay,
   deleteWay,
};
