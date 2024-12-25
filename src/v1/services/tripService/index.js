"use strict";
const __RESPONSE = require("../../core");
const {validationResult} = require("express-validator");
const db = require("../../models");
const {QueryTypes} = require("sequelize");
const moment = require("moment");
const mongoose = require("mongoose");

const getAllTrip = async (req) => {
   try {
      const {dateType, startTime, endTime, routeId, today, specificDate, dateRangeS, dateRangeE} = req.query;

      // Xây dựng câu lệnh SQL động
      let sqlQuery = `
         SELECT 
            t.trip_id,
            t.trip_arrival_time,
            t.trip_departure_time,
            t.trip_date,
            t.trip_price,
            t.trip_discount,
            t.trip_shuttle_enable,
            t.allow_online_booking,
            t.trip_holiday,
            
            r.route_id,
            r.route_name,
            r.route_price,
            
            v.vehicle_id,
            v.vehicle_license_plate,
            v.vehicle_code
            
         FROM trips t
         INNER JOIN routes r ON t.route_id = r.route_id
         INNER JOIN vehicles v ON t.vehicle_id = v.vehicle_id
         WHERE t.deleted_at IS NULL 
      `;

      const params = [];

      // Thêm điều kiện routeId nếu có
      if (routeId) {
         sqlQuery += ` AND t.route_id = ?`;
         params.push(routeId);
      }

      // Xử lý điều kiện ngày chỉ khi có dateType
      if (dateType) {
         switch (dateType) {
            case "today":
               // Sử dụng ngày hiện tại theo UTC
               const todayDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
               sqlQuery += ` AND DATE(t.trip_date) = ?`;
               params.push(todayDate);
               break;

            case "specific":
               if (specificDate) {
                  // Chỉ cần lấy phần ngày từ chuỗi ISO
                  const formattedSpecificDate = specificDate.slice(0, 10); // YYYY-MM-DD
                  sqlQuery += ` AND DATE(t.trip_date) = ?`;
                  params.push(formattedSpecificDate);
               }
               break;

            case "range":
               if (dateRangeS && dateRangeE) {
                  // Chỉ cần lấy phần ngày từ chuỗi ISO
                  const formattedStartDate = dateRangeS.slice(0, 10); // YYYY-MM-DD
                  const formattedEndDate = dateRangeE.slice(0, 10); // YYYY-MM-DD
                  sqlQuery += ` AND DATE(t.trip_date) BETWEEN ? AND ?`;
                  params.push(formattedStartDate, formattedEndDate);
               }
               break;
         }
      }

      // Xử lý điều kiện thời gian trong ngày
      if (startTime || endTime) {
         const formattedStartTime = startTime ? startTime.slice(11, 19) : null; // HH:MM:SS
         const formattedEndTime = endTime ? endTime.slice(11, 19) : null; // HH:MM:SS

         if (formattedStartTime && formattedEndTime) {
            sqlQuery += ` AND TIME(t.trip_departure_time) BETWEEN ? AND ?`;
            params.push(formattedStartTime, formattedEndTime);
         } else if (formattedStartTime) {
            sqlQuery += ` AND TIME(t.trip_departure_time) >= ?`;
            params.push(formattedStartTime);
         } else if (formattedEndTime) {
            sqlQuery += ` AND TIME(t.trip_departure_time) <= ?`;
            params.push(formattedEndTime);
         }
      }

      // Thêm sắp xếp
      sqlQuery += ` ORDER BY t.trip_id DESC`;

      // Thực hiện truy vấn
      const trips = await db.sequelize.query(sqlQuery, {
         replacements: params,
         type: QueryTypes.SELECT,
      });

      // Format dữ liệu trả về
      const formattedTrips = Array.isArray(trips)
         ? trips.map((trip) => ({
              trip_id: trip.trip_id,
              trip_arrival_time: trip.trip_arrival_time,
              trip_departure_time: trip.trip_departure_time,
              trip_date: trip.trip_date,
              trip_price: parseFloat(trip.trip_price || 0),
              trip_discount: parseFloat(trip.trip_discount || 0),
              trip_shuttle_enable: trip.trip_shuttle_enable || 0,
              allow_online_booking: trip.allow_online_booking || 0,
              trip_holiday: trip.trip_holiday || 0,
              route: {
                 route_id: trip.route_id,
                 route_name: trip.route_name || "",
                 route_price: parseFloat(trip.route_price || 0),
              },
              vehicle: {
                 vehicle_id: trip.vehicle_id,
                 vehicle_license_plate: trip.vehicle_license_plate || "",
                 vehicle_code: trip.vehicle_code || "",
              },
           }))
         : [];

      return {
         trips: formattedTrips,
         total: formattedTrips.length,
         filters: {
            dateType,
            startTime,
            endTime,
            routeId,
            today,
            specificDate,
            dateRangeS,
            dateRangeE,
         },
      };
   } catch (error) {
      throw new __RESPONSE.BadRequestError({
         message: "Không thể lấy danh sách chuyến xe: " + error.message,
         suggestion: "Vui lòng kiểm tra lại các tham số tìm kiếm",
      });
   }
};

const createTrip = async (req) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      throw new __RESPONSE.BadRequestError({
         message: "Validation failed " + errors.array()[0]?.msg + " !",
         suggestion: "Vui lòng kiểm tra lại dữ liệu",
         request: req,
      });
   }

   const {
      trip_arrival_time,
      trip_departure_time,
      trip_date,
      route_id,
      vehicle_id,
      trip_price,
      trip_discount,
      trip_shuttle_enable,
      allow_online_booking,
      trip_holiday,
   } = req.body;

   return await db.sequelize
      .transaction(async (transaction) => {
         const trip = await db.Trip.create(
            {
               trip_arrival_time: trip_arrival_time,
               trip_departure_time: trip_departure_time,
               trip_date: trip_date.slice(0, 10),
               route_id,
               vehicle_id,
               trip_price,
               trip_discount,
               trip_shuttle_enable,
               allow_online_booking,
               trip_holiday,
            },
            {transaction}
         );
         if (!trip)
            throw new __RESPONSE.BadRequestError({
               message: "Không thể tạo chuyến xe",
               suggestion: "Vui lòng thử lại sau",
            });
         return {
            message: "Tạo chuyến xe thành công",
            trip_id: trip,
         };
      })
      .catch((error) => {
         if (error.name === "SequelizeUniqueConstraintError" || error.code === "ER_DUP_ENTRY") {
            const field = error.fields || {};
            let errorMessage = "Đã tồn tại ";
            if (field.trip_date) {
               errorMessage += "chuyến xe này trong hệ thống";
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
         if (error instanceof __RESPONSE.BadRequestError) throw error;
         throw new __RESPONSE.BadRequestError({
            message: "Không thể tạo chuyến xe: " + error.message,
            suggestion: "Vui lòng thử lại sau",
         });
      });
};

const updateTrip = async (req) => {
   try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         throw new __RESPONSE.BadRequestError({
            message: "Validation failed " + errors.array()[0]?.msg + " !",
            suggestion: "Vui lòng kiểm tra lại dữ liệu",
            request: req,
         });
      }

      const {
         trip_id,
         trip_arrival_time,
         trip_departure_time,
         trip_date,
         route_id,
         vehicle_id,
         trip_price,
         trip_discount,
         trip_shuttle_enable,
         allow_online_booking,
         trip_holiday,
      } = req.body;

      return await db.sequelize
         .transaction(async (transaction) => {
            // Kiểm tra trip tồn tại
            const existingTrip = await db.Trip.findOne({
               where: {
                  trip_id,
               },
            });

            if (!existingTrip) {
               throw new __RESPONSE.NotFoundError({
                  message: "Không tìm thấy chuyến xe",
                  suggestion: "Vui lòng kiểm tra lại ID chuyến xe",
               });
            }

            // Cập nhật thông tin
            const updatedTrip = await existingTrip.update(
               {
                  trip_arrival_time: trip_arrival_time || existingTrip.trip_arrival_time,
                  trip_departure_time: trip_departure_time || existingTrip.trip_departure_time,
                  trip_date: trip_date || existingTrip.trip_date,
                  route_id: route_id || existingTrip.route_id,
                  vehicle_id: vehicle_id || existingTrip.vehicle_id,
                  trip_price: trip_price || existingTrip.trip_price,
                  trip_discount: trip_discount || existingTrip.trip_discount,
                  trip_shuttle_enable:
                     trip_shuttle_enable !== undefined ? trip_shuttle_enable : existingTrip.trip_shuttle_enable,
                  allow_online_booking:
                     allow_online_booking !== undefined ? allow_online_booking : existingTrip.allow_online_booking,
                  trip_holiday: trip_holiday !== undefined ? trip_holiday : existingTrip.trip_holiday,
               },
               {transaction}
            );

            return {
               message: "Cập nhật chuyến xe thành công",
               trip: updatedTrip,
            };
         })
         .catch((error) => {
            if (error.name === "SequelizeUniqueConstraintError" || error.code === "ER_DUP_ENTRY") {
               const field = error.fields || {};
               throw new __RESPONSE.BadRequestError({
                  message: "Đã tồn tại chuyến xe này trong hệ thống",
                  suggestion: "Vui lòng thử lại với thông tin khác",
                  request: req,
                  field: field,
               });
            }
            if (error instanceof __RESPONSE.BadRequestError || error instanceof __RESPONSE.NotFoundError) {
               throw error;
            }
            throw new __RESPONSE.BadRequestError({
               message: "Không thể cập nhật chuyến xe: " + error.message,
               suggestion: "Vui lòng thử lại sau",
            });
         });
   } catch (error) {
      throw error;
   }
};

const deleteTrip = async (req) => {
   try {
      const {trip_id} = req.params;

      if (!trip_id)
         throw new __RESPONSE.BadRequestError({
            message: "Vui lòng nhập ID chuyến xe",
            suggestion: "Vui lòng kiểm tra lại ID chuyến xe",
         });

      return await db.sequelize
         .transaction(async (transaction) => {
            const existingTrip = await db.Trip.findOne({
               where: {
                  trip_id,
                  deleted_at: null,
               },
            });

            if (!existingTrip) {
               throw new __RESPONSE.NotFoundError({
                  message: "Không tìm thấy chuyến xe",
                  suggestion: "Vui lòng kiểm tra lại ID chuyến xe",
               });
            }
            await existingTrip.destroy().then((count) => {
               if (count === 0)
                  throw new __RESPONSE.BadRequestError({
                     message: "Không thể xóa chuyến xe",
                     suggestion: "Vui lòng thử lại sau",
                  });
               return {
                  message: "Xóa chuyến xe thành công",
                  trip_id: trip_id,
               };
            });
         })
         .catch((error) => {
            if (error instanceof __RESPONSE.BadRequestError || error instanceof __RESPONSE.NotFoundError) {
               throw error;
            }
            throw new __RESPONSE.BadRequestError({
               message: "Không thể xóa chuyến xe: " + error.message,
               suggestion: "Vui lòng thử lại sau",
            });
         });
   } catch (error) {
      throw error;
   }
};

const updateTicketPriceAdvance = async (req) => {
   try {
      const {trip_id, fromDate, toDate, price, discount, user_id} = req.body;

      if (!fromDate || !toDate || !price || !trip_id || !user_id) {
         throw new __RESPONSE.BadRequestError({
            message: "Thiếu thông tin cần thiết",
            suggestion: "Vui lòng cung cấp đầy đủ trip_id, ngày bắt đầu, ngày kết thúc và giá vé",
         });
      }

      const fromDateUTC = moment.tz(fromDate, "Asia/Ho_Chi_Minh").utc().toDate();
      const toDateUTC = moment.tz(toDate, "Asia/Ho_Chi_Minh").utc().toDate();

      // Sử dụng connection có sẵn từ mongoose
      const priceCollection = mongoose.connection.collection("price_tickets");
      const priceHistoryCollection = mongoose.connection.collection("price_tickets_history");

      // Tìm thông tin giá hiện tại
      const currentPrice = await priceCollection.findOne({trip_id: trip_id});

      // Nếu có giá cũ, lưu vào lịch sử
      if (currentPrice) {
         await priceHistoryCollection.insertOne({
            trip_id: currentPrice.trip_id,
            old_price: currentPrice.trip_price,
            old_discount: currentPrice.trip_discount,
            old_from_date: currentPrice.from_date,
            old_to_date: currentPrice.to_date,
            changed_at: new Date(),
            changed_by: user_id,
         });
      }

      // Cập nhật giá mới
      const result = await priceCollection.updateOne(
         {trip_id: trip_id},
         {
            $set: {
               trip_id: trip_id,
               trip_price: parseFloat(price),
               trip_discount: parseFloat(discount || 0),
               from_date: fromDateUTC,
               to_date: toDateUTC,
               updated_at: new Date(),
               updated_by: user_id,
            },
         },
         {upsert: true}
      );

      return {
         message: "Cập nhật giá vé thành công",
         modifiedCount: result.modifiedCount,
         matchedCount: result.matchedCount,
         previousPrice: currentPrice
            ? {
                 price: currentPrice.trip_price,
                 discount: currentPrice.trip_discount,
                 from_date: currentPrice.from_date,
                 to_date: currentPrice.to_date,
              }
            : null,
         newPrice: {
            price: parseFloat(price),
            discount: parseFloat(discount || 0),
            from_date: fromDateUTC,
            to_date: toDateUTC,
         },
      };
   } catch (error) {
      throw new __RESPONSE.BadRequestError({
         message: "Không thể cập nhật giá vé: " + error.message,
         suggestion: "Vui lòng thử lại sau",
      });
   }
};

const countTrip = async () => {
   return await db.Trip.count()
      .then((count) => {
         return {
            count: count,
         };
      })
      .catch((error) => {
         throw new __RESPONSE.BadRequestError({
            message: "Count trip failed " + error.message,
            suggestion: "Please check again your request",
         });
      });
};

module.exports = {
   getAllTrip,
   createTrip,
   updateTrip,
   deleteTrip,
   updateTicketPriceAdvance,
   countTrip,
};
