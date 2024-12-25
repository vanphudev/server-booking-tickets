"use strict";
const __RESPONSE = require("../../core");
const db = require("../../models");
const {validationResult} = require("express-validator");
const {QueryTypes} = require("sequelize");
const moment = require("moment-timezone");
const mongoose = require("mongoose");

const getAllRoutes = async () => {
   try {
      const routes = await db.sequelize.query(
         `
                  SELECT DISTINCT
            po.province_id as origin_province_id,
            po.province_name as origin_province,
            do.district_name as origin_district,
            wo.ward_name as origin_ward,
            oo.office_name as origin_office,
            
            pd.province_id as destination_province_id,
            pd.province_name as destination_province,
            dd.district_name as destination_district,
            wd.ward_name as destination_ward,
            od.office_name as destination_office,
            vt.vehicle_type_name,
            
            r.route_price,
            r.route_duration,
            r.route_distance,
            r.route_id
            
         FROM routes r
         INNER JOIN offices oo ON r.origin_office_id = oo.office_id
         INNER JOIN wards wo ON oo.ward_id = wo.ward_id
         INNER JOIN districts do ON wo.district_id = do.district_id
         INNER JOIN provinces po ON do.province_id = po.province_id

         INNER JOIN offices od ON r.destination_office_id = od.office_id
         INNER JOIN wards wd ON od.ward_id = wd.ward_id
         INNER JOIN districts dd ON wd.district_id = dd.district_id
         INNER JOIN provinces pd ON dd.province_id = pd.province_id

         INNER JOIN trips t ON r.route_id = t.route_id
         INNER JOIN vehicles v ON t.vehicle_id = v.vehicle_id
         INNER JOIN map_vehicle_layouts mvl ON v.map_vehicle_layout_id = mvl.map_vehicle_layout_id
         INNER JOIN vehicle_types vt ON mvl.vehicle_type_id = vt.vehicle_type_id

         WHERE r.deleted_at IS NULL
      `,
         {
            type: QueryTypes.SELECT,
         }
      );

      if (!routes) {
         throw new __RESPONSE.NotFoundError({
            message: "Routes not found !",
            suggestion: "Please check your request",
         });
      }

      return {
         routes: routes,
         total: routes.length,
      };
   } catch (error) {
      if (error instanceof __RESPONSE.BadRequestError) {
         throw error;
      }
      throw new __RESPONSE.BadRequestError({
         message: "Routes not found !",
         suggestion: "Please check your request",
      });
   }
};

const getTrips = async (req) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      throw new __RESPONSE.BadRequestError({
         message: "Validation failed " + errors.array()[0]?.msg + " !",
         suggestion: "Please provide the correct data",
         request: req,
      });
   }
   try {
      const {fromId, fromTime, toId, toTime, isReturn, ticketCount} = req.query;

      const departureTripsQuery = `
            SELECT 
                t.trip_id,
                t.trip_departure_time,
                t.trip_arrival_time,
                t.trip_date,
                t.trip_price,
                t.trip_discount,
                t.trip_shuttle_enable,
                t.allow_online_booking,
                t.trip_holiday,
                t.vehicle_id,
                
                r.route_id,
                r.route_price,
                r.route_duration,
                r.route_distance,
                
                vt.vehicle_type_name,
                
                po.province_id as origin_province_id,
                po.province_name as origin_province,
                do.district_name as origin_district,
                wo.ward_name as origin_ward,
                oo.office_name as origin_office,
                
                pd.province_id as destination_province_id,
                pd.province_name as destination_province,
                dd.district_name as destination_district,
                wd.ward_name as destination_ward,
                od.office_name as destination_office,
                
                (SELECT COUNT(*) 
                 FROM booking_seats bs 
                 WHERE bs.trip_id = t.trip_id 
                 AND bs.booking_seat_status = 0 
                 AND bs.deleted_at IS NULL) as available_seats
                
            FROM trips t
            INNER JOIN routes r ON t.route_id = r.route_id
            INNER JOIN vehicles v ON t.vehicle_id = v.vehicle_id
            INNER JOIN map_vehicle_layouts mvl ON v.map_vehicle_layout_id = mvl.map_vehicle_layout_id
            INNER JOIN vehicle_types vt ON mvl.vehicle_type_id = vt.vehicle_type_id
            
            INNER JOIN offices oo ON r.origin_office_id = oo.office_id
            INNER JOIN wards wo ON oo.ward_id = wo.ward_id
            INNER JOIN districts do ON wo.district_id = do.district_id
            INNER JOIN provinces po ON do.province_id = po.province_id
            
            INNER JOIN offices od ON r.destination_office_id = od.office_id
            INNER JOIN wards wd ON od.ward_id = wd.ward_id
            INNER JOIN districts dd ON wd.district_id = dd.district_id
            INNER JOIN provinces pd ON dd.province_id = pd.province_id
            
            WHERE po.province_id = ?
            AND pd.province_id = ?
            AND DATE(t.trip_date) = DATE(?)
            AND t.allow_online_booking = 1
            AND t.deleted_at IS NULL
            AND r.deleted_at IS NULL
            HAVING available_seats >= ?
            ORDER BY t.trip_departure_time ASC
        `;

      // Thực hiện query chuyến đi
      const departureTrips = await db.sequelize.query(departureTripsQuery, {
         replacements: [fromId, toId, fromTime, ticketCount],
         type: QueryTypes.SELECT,
      });

      // Lấy booking_seats cho mỗi trip
      const tripsWithSeats = await Promise.all(
         departureTrips.map(async (trip) => {
            // Lấy seats từ MySQL
            const seats = await db.sequelize.query(
               `SELECT 
                    bs.booking_seat_id,
                    bs.seat_name,
                    bs.booking_seat_status,
                    bs.is_locked,
                    bs.map_vehicle_seat_id
                FROM booking_seats bs
                WHERE bs.trip_id = ?
                AND bs.deleted_at IS NULL
                ORDER BY bs.seat_name`,
               {
                  replacements: [trip.trip_id],
                  type: QueryTypes.SELECT,
               }
            );

            // Kiểm tra giá từ MongoDB
            const priceCollection = mongoose.connection.collection("price_tickets");
            const currentDate = new Date();

            const priceInfo = await priceCollection.findOne({
               trip_id: trip.trip_id,
               from_date: {$lte: currentDate},
               to_date: {$gte: currentDate},
            });

            // Nếu có giá trong MongoDB thì cập nhật, không thì giữ nguyên giá MySQL
            const updatedTrip = {
               ...trip,
               booking_seats: seats,
            };

            if (priceInfo) {
               updatedTrip.trip_price = priceInfo.trip_price;
               updatedTrip.trip_discount = priceInfo.trip_discount;
            }

            return updatedTrip;
         })
      );

      // Nếu có chuyến về
      let returnTrips = [];
      if (isReturn && toTime) {
         const returnTripsQuery = departureTripsQuery; // Dùng lại query nhưng đổi tham số
         returnTrips = await db.sequelize.query(returnTripsQuery, {
            replacements: [toId, fromId, toTime, ticketCount], // Đảo ngược fromId và toId
            type: QueryTypes.SELECT,
         });

         // Lấy booking_seats cho chuyến về
         returnTrips = await Promise.all(
            returnTrips.map(async (trip) => {
               const seats = await db.sequelize.query(
                  `SELECT 
                        bs.booking_seat_id,
                        bs.seat_name,
                        bs.booking_seat_status,
                        bs.is_locked,
                        bs.map_vehicle_seat_id
                    FROM booking_seats bs
                    WHERE bs.trip_id = ?
                    AND bs.deleted_at IS NULL
                    ORDER BY bs.seat_name`,
                  {
                     replacements: [trip.trip_id],
                     type: QueryTypes.SELECT,
                  }
               );

               return {
                  ...trip,
                  booking_seats: seats,
               };
            })
         );
      }

      return {
         departureTrips: tripsWithSeats,
         returnTrips: isReturn ? returnTrips : null,
         total: {
            departureTrips: tripsWithSeats.length,
            returnTrips: isReturn ? returnTrips.length : 0,
         },
      };
   } catch (error) {
      throw new __RESPONSE.BadRequestError({
         message: "Failed to get trips" + error.message,
         suggestion: "Please check your request parameters",
      });
   }
};

const getRouteReviews = async (routeId) => {
   try {
      if (!routeId) {
         throw new __RESPONSE.BadRequestError({
            message: "Route ID is required",
            suggestion: "Please provide a valid route ID",
         });
      }

      const reviewsQuery = `
            SELECT 
                pp.pickup_point_name,
                pp.pickup_point_time,
                pp.pickup_point_kind,
                pp.pickup_point_description,
                pp.point_kind_name,
                
                o.office_id,
                o.office_name,
                o.office_address,
                o.office_phone,
                o.office_latitude,
                o.office_longitude,
                o.office_map_url,
                
                p.province_name,
                d.district_name,
                w.ward_name
                
            FROM routes r
            INNER JOIN ways way ON r.way_id = way.way_id
            INNER JOIN pickup_points pp ON way.way_id = pp.pickup_point_way_id
            INNER JOIN offices o ON pp.pickup_point_office_id = o.office_id
            INNER JOIN wards w ON o.ward_id = w.ward_id
            INNER JOIN districts d ON w.district_id = d.district_id
            INNER JOIN provinces p ON d.province_id = p.province_id
            
            WHERE r.route_id = ?
            AND r.deleted_at IS NULL
            AND way.deleted_at IS NULL
            AND pp.deleted_at IS NULL
            AND o.deleted_at IS NULL
            
            ORDER BY pp.pickup_point_time ASC
        `;

      const pickupPoints = await db.sequelize.query(reviewsQuery, {
         replacements: [routeId],
         type: QueryTypes.SELECT,
      });

      return pickupPoints.map((point) => ({
         pickup_point: {
            name: point.pickup_point_name,
            time: point.pickup_point_time,
            kind: point.pickup_point_kind,
            description: point.pickup_point_description,
            kind_name: point.point_kind_name,
         },
         office: {
            id: point.office_id,
            name: point.office_name,
            address: point.office_address,
            phone: point.office_phone,
            location: {
               latitude: point.office_latitude,
               longitude: point.office_longitude,
               map_url: point.office_map_url,
            },
            address_detail: {
               province: point.province_name,
               district: point.district_name,
               ward: point.ward_name,
            },
         },
      }));
   } catch (error) {
      throw new __RESPONSE.BadRequestError({
         message: "Failed to get route pickup points: " + error.message,
         suggestion: "Please check your route ID or try again later",
      });
   }
};

const getRoutePickupPoints = async (routeId) => {
   try {
      if (!routeId) {
         throw new __RESPONSE.BadRequestError({
            message: "Route ID is required",
            suggestion: "Please provide a valid route ID",
         });
      }

      const pickupPointsQuery = `
            SELECT 
                w.way_id,
                w.way_name,
                w.way_description,
                
                pp.pickup_point_name,
                pp.pickup_point_time,
                pp.pickup_point_kind,
                pp.pickup_point_description,
                pp.point_kind_name,
                
                o.office_id,
                o.office_name,
                o.office_address,
                o.office_phone,
                o.office_latitude,
                o.office_longitude,
                o.office_map_url,
                
                p.province_name,
                d.district_name,
                wd.ward_name
                
            FROM routes r
            INNER JOIN ways w ON r.way_id = w.way_id
            INNER JOIN pickup_points pp ON w.way_id = pp.pickup_point_way_id
            INNER JOIN offices o ON pp.pickup_point_office_id = o.office_id
            INNER JOIN wards wd ON o.ward_id = wd.ward_id
            INNER JOIN districts d ON wd.district_id = d.district_id
            INNER JOIN provinces p ON d.province_id = p.province_id
            
            WHERE r.route_id = ?
            AND r.deleted_at IS NULL
            AND w.deleted_at IS NULL
            AND pp.deleted_at IS NULL
            AND o.deleted_at IS NULL
            
            ORDER BY pp.pickup_point_time ASC
        `;

      const pickupPoints = await db.sequelize.query(pickupPointsQuery, {
         replacements: [routeId],
         type: QueryTypes.SELECT,
      });

      const groupedByWay = pickupPoints.reduce((acc, point) => {
         const wayId = point.way_id;
         if (!acc[wayId]) {
            acc[wayId] = {
               way_id: wayId,
               way_name: point.way_name,
               way_description: point.way_description,
               pickup_points: [],
            };
         }

         acc[wayId].pickup_points.push({
            office: {
               id: point.office_id,
               name: point.office_name,
               address: point.office_address,
               phone: point.office_phone,
               location: {
                  latitude: point.office_latitude,
                  longitude: point.office_longitude,
                  map_url: point.office_map_url,
               },
               address_detail: {
                  province: point.province_name,
                  district: point.district_name,
                  ward: point.ward_name,
               },
            },
            pickup_point_name: point.pickup_point_name,
            pickup_point_time: point.pickup_point_time,
            pickup_point_kind: point.pickup_point_kind,
            pickup_point_description: point.pickup_point_description,
            point_kind_name: point.point_kind_name,
         });

         return acc;
      }, {});

      // Chuyển đổi từ object sang array
      const result = Object.values(groupedByWay);

      return {
         route_id: routeId,
         ways: result,
         total_ways: result.length,
         total_pickup_points: pickupPoints.length,
      };
   } catch (error) {
      throw new __RESPONSE.BadRequestError({
         message: "Failed to get route pickup points: " + error.message,
         suggestion: "Please check your route ID or try again later",
      });
   }
};

const addWayPickupPoints = async (wayId, pickupPoints) => {
   try {
      if (!wayId) {
         throw new __RESPONSE.BadRequestError({
            message: "Way ID is required",
            suggestion: "Please provide a valid way ID",
         });
      }

      if (!Array.isArray(pickupPoints) || pickupPoints.length < 2) {
         throw new __RESPONSE.BadRequestError({
            message: "At least 2 pickup points are required (start and end points)",
            suggestion: "Please provide valid pickup points array",
         });
      }

      // Kiểm tra way tồn tại
      const way = await db.sequelize.query(`SELECT way_id FROM ways WHERE way_id = ? AND deleted_at IS NULL`, {
         replacements: [wayId],
         type: QueryTypes.SELECT,
      });

      if (!way.length) {
         throw new __RESPONSE.BadRequestError({
            message: "Way not found",
            suggestion: "Please check your way ID",
         });
      }

      // Validate và insert pickup points
      const insertQuery = `
            INSERT INTO pickup_points (
                pickup_point_way_id,
                pickup_point_office_id,
                pickup_point_name,
                pickup_point_time,
                pickup_point_kind,
                pickup_point_description,
                point_kind_name
            ) VALUES ?
        `;

      const values = pickupPoints.map((point) => [
         wayId,
         point.office_id,
         point.name,
         point.time,
         point.kind, // -1: start, 0: middle, 1: end
         point.description || null,
         point.kind_name || null,
      ]);

      await db.sequelize.query(insertQuery, {
         replacements: [values],
         type: QueryTypes.INSERT,
      });

      // Lấy danh sách pickup points vừa thêm để trả về
      const result = await db.sequelize.query(
         `
            SELECT 
                pp.*,
                o.office_name,
                o.office_address,
                o.office_phone,
                o.office_latitude,
                o.office_longitude,
                o.office_map_url,
                p.province_name,
                d.district_name,
                w.ward_name
            FROM pickup_points pp
            INNER JOIN offices o ON pp.pickup_point_office_id = o.office_id
            INNER JOIN wards w ON o.ward_id = w.ward_id
            INNER JOIN districts d ON w.district_id = d.district_id
            INNER JOIN provinces p ON d.province_id = p.province_id
            WHERE pp.pickup_point_way_id = ?
            AND pp.deleted_at IS NULL
            ORDER BY pp.pickup_point_time ASC
        `,
         {
            replacements: [wayId],
            type: QueryTypes.SELECT,
         }
      );

      return {
         way_id: wayId,
         pickup_points: result,
         total_points: result.length,
      };
   } catch (error) {
      if (error instanceof __RESPONSE.BadRequestError) {
         throw error;
      }
      throw new __RESPONSE.BadRequestError({
         message: "Failed to add pickup points: " + error.message,
         suggestion: "Please check your input data",
      });
   }
};

const getAllRouter_Admin = async () => {
   try {
      const routes = await db.sequelize.query(
         `
         SELECT 
            r.route_id,
            r.route_name,
            r.route_duration,
            r.route_distance,
            r.route_url_gps,
            r.origin_office_id,
            r.destination_office_id,
            r.route_price,
            r.is_default,
            r.is_locked,
            r.last_lock_at,
            
            w.way_id,
            w.way_name,
            w.way_description,
            
            oo.office_id as origin_office_id,
            oo.office_name as origin_office_name,
            
            do.office_id as destination_office_id,
            do.office_name as destination_office_name
            
         FROM routes r
         LEFT JOIN ways w ON r.way_id = w.way_id
         LEFT JOIN offices oo ON r.origin_office_id = oo.office_id
         LEFT JOIN offices do ON r.destination_office_id = do.office_id
         WHERE r.deleted_at IS NULL
         AND w.deleted_at IS NULL
         AND oo.deleted_at IS NULL
         AND do.deleted_at IS NULL
      `,
         {
            type: QueryTypes.SELECT,
         }
      );

      // Chuyển đổi kết quả sang định dạng mong muốn
      const formattedRoutes = routes.map((route) => ({
         route_id: route.route_id,
         route_name: route.route_name,
         route_duration: route.route_duration,
         route_distance: route.route_distance,
         route_url_gps: route.route_url_gps,
         origin_office_id: route.origin_office_id,
         destination_office_id: route.destination_office_id,
         route_price: route.route_price,
         is_default: route.is_default,
         is_locked: route.is_locked,
         last_lock_at: route.last_lock_at,
         way: {
            way_id: route.way_id,
            way_name: route.way_name,
            way_description: route.way_description,
            origin_office: {
               office_id: route.origin_office_id,
               office_name: route.origin_office_name,
            },
            destination_office: {
               office_id: route.destination_office_id,
               office_name: route.destination_office_name,
            },
         },
      }));

      return {
         routes: formattedRoutes,
         total: formattedRoutes.length,
      };
   } catch (error) {
      throw new __RESPONSE.BadRequestError({
         message: "Không thể lấy danh sách tuyến xe: " + error.message,
         suggestion: "Vui lòng thử lại sau",
      });
   }
};

const createRoute = async (req) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      throw new __RESPONSE.BadRequestError({
         message: "Validation failed " + errors.array()[0]?.msg + " !",
         suggestion: "Please provide the correct data",
         request: req,
      });
   }
   const {
      route_name,
      route_duration,
      route_distance,
      route_url_gps,
      origin_office_id,
      destination_office_id,
      route_price,
      is_default,
      is_locked,
      way_id,
   } = req.body;

   return await db.Route.create({
      route_name,
      route_duration,
      route_distance,
      route_url_gps: route_url_gps || null,
      route_price,
      is_default: is_default && is_default == 1 ? 1 : 0,
      is_locked: is_locked && is_locked == 1 ? 1 : 0,
      way_id,
      last_lock_at: is_locked ? new Date() : null,
   })
      .then(async (route) => {
         if (!route) {
            throw new __RESPONSE.BadRequestError({
               message: "Không thể tạo tuyến xe",
               suggestion: "Vui lòng thử lại sau",
            });
         }
         return {
            message: "Tạo tuyến xe thành công",
            route,
         };
      })
      .catch((error) => {
         if (error.name === "SequelizeUniqueConstraintError" || error.code === "ER_DUP_ENTRY") {
            const field = error.fields || {};
            let errorMessage = "Đã tồn tại ";
            if (field.route_name) {
               errorMessage += "tên tuyến xe này trong hệ thống";
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
         if (error instanceof __RESPONSE.BadRequestError) {
            throw error;
         }
         throw new __RESPONSE.BadRequestError({
            message: "Không thể tạo tuyến xe: " + error.message,
            suggestion: "Vui lòng thử lại sau",
         });
      });
};

const updateRoute = async (req) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      throw new __RESPONSE.BadRequestError({
         message: "Validation failed " + errors.array()[0]?.msg + " !",
         suggestion: "Vui lòng kiểm tra lại dữ liệu",
         request: req,
      });
   }

   const {
      route_id,
      route_name,
      route_duration,
      route_distance,
      route_url_gps,
      origin_office_id,
      destination_office_id,
      route_price,
      is_default,
      is_locked,
      way_id,
   } = req.body;

   try {
      const route = await db.Route.findOne({
         where: {route_id},
         attributes: {exclude: ["office_id"]},
      });

      if (!route) {
         throw new __RESPONSE.NotFoundError({
            message: "Không tìm thấy tuyến xe",
            suggestion: "Vui lòng kiểm tra lại ID tuyến xe",
         });
      }

      const updatedRoute = await route.update({
         route_name: route_name || route.route_name,
         route_duration: route_duration || route.route_duration,
         route_distance: route_distance || route.route_distance,
         route_url_gps: route_url_gps || route.route_url_gps,
         origin_office_id: origin_office_id || route.origin_office_id,
         destination_office_id: destination_office_id || route.destination_office_id,
         route_price: route_price || route.route_price,
         is_default: is_default !== undefined ? (is_default == 1 ? 1 : 0) : route.is_default,
         is_locked: is_locked !== undefined ? (is_locked == 1 ? 1 : 0) : route.is_locked,
         way_id: way_id || route.way_id,
         last_lock_at:
            is_locked !== undefined ? (is_locked == 1 ? new Date() : route.last_lock_at) : route.last_lock_at,
      });

      return {
         message: "Cập nhật tuyến xe thành công",
         route: updatedRoute,
      };
   } catch (error) {
      if (error instanceof __RESPONSE.NotFoundError) {
         throw error;
      }

      throw new __RESPONSE.BadRequestError({
         message: "Không thể cập nhật tuyến xe: " + error.message,
         suggestion: "Vui lòng thử lại sau",
      });
   }
};

const deleteRoute = async (req) => {
   const {route_id} = req.params;
   if (!route_id) {
      throw new __RESPONSE.BadRequestError({
         message: "ID tuyến xe không hợp lệ",
         suggestion: "Vui lòng kiểm tra lại ID tuyến xe",
      });
   }
   const route = await db.Route.findOne({
      where: {route_id},
      attributes: {exclude: ["office_id"]},
   });

   if (!route) {
      throw new __RESPONSE.NotFoundError({
         message: "Không tìm thấy tuyến xe",
         suggestion: "Vui lòng kiểm tra lại ID tuyến xe",
      });
   }

   await route
      .destroy()
      .then((count) => {
         if (count == 0) {
            throw new __RESPONSE.BadRequestError({
               message: "Không thể xóa tuyến xe",
               suggestion: "Vui lòng thử lại sau",
            });
         }

         return {
            message: "Xóa tuyến xe thành công",
            route_id: route_id,
         };
      })
      .catch((error) => {
         if (error.name === "ForeignKeyConstraintError" || error.code === "ER_ROW_IS_REFERENCED_2") {
            throw new __RESPONSE.BadRequestError({
               message: "Không thể xóa tuyến xe vì đã có chuyến xe sử dụng",
               suggestion: "Vui lòng xóa chuyến xe trước",
            });
         }
         if (error instanceof __RESPONSE.BadRequestError) {
            throw error;
         }

         throw new __RESPONSE.BadRequestError({
            message: "Không thể xóa tuyến xe: " + error.message,
            suggestion: "Vui lòng thử lại sau",
         });
      });
};

module.exports = {
   getAllRoutes,
   getTrips,
   getRouteReviews,
   getRoutePickupPoints,
   addWayPickupPoints,
   getAllRouter_Admin,
   createRoute,
   updateRoute,
   deleteRoute,
};
