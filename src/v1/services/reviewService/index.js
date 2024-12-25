"use strict";
const __RESPONSE = require("../../core");
const {validationResult} = require("express-validator");
const db = require("../../models");
const {QueryTypes} = require("sequelize");

const getAllReviews = async (req) => {
   return await db.Review.findAll()
      .then((reviews) => {
         if (!reviews) {
            throw new __RESPONSE.NotFoundError({
               message: "Không tìm thấy đánh giá nào - Kiểm tra lại đánh giá bạn nhé!",
            });
         }
         return {reviews};
      })
      .catch((error) => {
         throw new __RESPONSE.BadRequestError({
            message: "Lỗi lấy danh sách đánh giá - Kiểm tra lại đánh giá bạn nhé!",
         });
      });
};

const getReviewByRouteId = async (req) => {
   const {route_id} = req.params;
   const [reviews, reviewStats] = await Promise.all([
      // Query to get individual reviews
      db.Review.findAll({
         where: {route_id: route_id},
         include: [
            {
               model: db.Customer,
               as: "review_belongto_customer",
               attributes: ["customer_id", "customer_full_name", "customer_email"],
            },
            {
               model: db.Trip,
               as: "review_belongto_trip",
            },
         ],
      }),

      // Query to get aggregated stats
      db.Review.findAll({
         where: {route_id: route_id},
         attributes: [
            [db.sequelize.fn("AVG", db.sequelize.col("review_rating")), "average_rating"],
            [db.sequelize.fn("COUNT", db.sequelize.col("review_id")), "total_reviews"],
            [db.sequelize.literal(`SUM(CASE WHEN review_rating = 5 THEN 1 ELSE 0 END)`), "five_star_count"],
            [db.sequelize.literal(`SUM(CASE WHEN review_rating = 4 THEN 1 ELSE 0 END)`), "four_star_count"],
            [db.sequelize.literal(`SUM(CASE WHEN review_rating = 3 THEN 1 ELSE 0 END)`), "three_star_count"],
            [db.sequelize.literal(`SUM(CASE WHEN review_rating = 2 THEN 1 ELSE 0 END)`), "two_star_count"],
            [db.sequelize.literal(`SUM(CASE WHEN review_rating = 1 THEN 1 ELSE 0 END)`), "one_star_count"],
            [
               db.sequelize.literal(`
               ROUND(
                  SUM(CASE WHEN review_rating = 5 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2
               )
            `),
               "five_star_percent",
            ],
            [
               db.sequelize.literal(`
               ROUND(
                  SUM(CASE WHEN review_rating = 4 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2
               )
            `),
               "four_star_percent",
            ],
            [
               db.sequelize.literal(`
               ROUND(
                  SUM(CASE WHEN review_rating = 3 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2
               )
            `),
               "three_star_percent",
            ],
            [
               db.sequelize.literal(`
               ROUND(
                  SUM(CASE WHEN review_rating = 2 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2
               )
            `),
               "two_star_percent",
            ],
            [
               db.sequelize.literal(`
               ROUND(
                  SUM(CASE WHEN review_rating = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2
               )
            `),
               "one_star_percent",
            ],
         ],
         group: ["route_id"],
      }),
   ]);

   return {
      reviews,
      stats: reviewStats[0],
   };
};

const createReview = async (req) => {
   const {review_rating, review_date, review_comment, route_id, customer_id, trip_id, booking_id} = req.body;
   // Kiểm tra review_rating
   if (!review_rating || review_rating < 1 || review_rating > 5) {
      throw new __RESPONSE.BadRequestError({
         message: "Đánh giá phải từ 1-5 sao",
         suggestion: "Vui lòng chọn số sao từ 1-5",
         request: req,
      });
   }

   // Kiểm tra review_date
   if (!review_date || !Date.parse(review_date)) {
      throw new __RESPONSE.BadRequestError({
         message: "Ngày đánh giá không hợp lệ",
         suggestion: "Vui lòng nhập đúng định dạng ngày",
         request: req,
      });
   }

   // Kiểm tra review_comment
   if (!review_comment || review_comment.trim().length < 10) {
      throw new __RESPONSE.BadRequestError({
         message: "Nội dung đánh giá phải có ít nhất 10 ký tự",
         suggestion: "Vui lòng nhập nội dung đánh giá chi tiết hơn",
         request: req,
      });
   }

   // Kiểm tra route_id
   if (!route_id) {
      throw new __RESPONSE.BadRequestError({
         message: "Thiếu thông tin tuyến đường",
         suggestion: "Vui lòng chọn tuyến đường cần đánh giá",
         request: req,
      });
   }

   // Kiểm tra customer_id
   if (!customer_id) {
      throw new __RESPONSE.BadRequestError({
         message: "Thiếu thông tin khách hàng",
         suggestion: "Vui lòng đăng nhập để đánh giá",
         request: req,
      });
   }

   // Kiểm tra trip_id
   if (!trip_id) {
      throw new __RESPONSE.BadRequestError({
         message: "Thiếu thông tin chuyến đi",
         suggestion: "Vui lòng chọn chuyến đi cần đánh giá",
         request: req,
      });
   }

   // Kiểm tra booking_id
   if (!booking_id) {
      throw new __RESPONSE.BadRequestError({
         message: "Thiếu thông tin đặt vé",
         suggestion: "Vui lòng chọn vé cần đánh giá",
         request: req,
      });
   }
   return await db.Review.create({
      review_rating,
      review_date,
      review_comment,
      route_id,
      customer_id,
      trip_id,
      booking_id,
   })
      .then((review) => {
         if (!review) {
            throw new __RESPONSE.NotFoundError({
               message: "Không tìm thấy đánh giá nào - Kiểm tra lại đánh giá bạn nhé!",
            });
         }

         // gửi mail cảm ơn quý khách/
         return {review};
      })
      .catch((error) => {
         if (error.name === "SequelizeValidationError") {
            throw new __RESPONSE.BadRequestError({
               message: "Lỗi tạo đánh giá - Kiểm tra lại đánh giá bạn nhé!",
               suggestion: "Please check your request",
               request: req,
            });
         }
         throw new __RESPONSE.BadRequestError({
            message: "Lỗi tạo đánh giá - Kiểm tra lại đánh giá bạn nhé!",
         });
      });
};

const duyetReview = async (req) => {
   const {review_id} = req.params;
   return await db.Review.update(
      {
         is_locked: 1,
      },
      {
         where: {
            review_id: review_id,
         },
      }
   )
      .then((review) => {
         if (!review) {
            throw new __RESPONSE.NotFoundError({
               message: "Không tìm thấy đánh giá nào - Kiểm tra lại đánh giá bạn nhé!",
            });
         }
         return {review};
      })
      .catch((error) => {
         throw new __RESPONSE.BadRequestError({
            message: "Lỗi duyệt đánh giá - Kiểm tra lại đánh giá bạn nhé!",
         });
      });
};

module.exports = {
   getAllReviews,
   getReviewByRouteId,
   createReview,
   duyetReview,
};
