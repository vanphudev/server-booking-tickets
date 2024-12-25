"use strict";

const __RESPONSE = require("../../core/");
const {getAllReviews, getReviewByRouteId, createReview, duyetReview} = require("../../services/reviewService");

const __REVIEW_CONTROLLER = {
   getAllReviews: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "Lấy danh sách đánh giá thành công!",
         metadata: await getAllReviews(req),
         request: req,
      }).send(res);
   },
   getReviewByRouteId: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "Lấy đánh giá theo route thành công!",
         metadata: await getReviewByRouteId(req),
         request: req,
      }).send(res);
   },
   createReview: async (req, res, next) => {
      new __RESPONSE.CREATED({
         message: "Tạo đánh giá thành công!",
         metadata: await createReview(req),
         request: req,
      }).send(res);
   },
   duyetReview: async (req, res, next) => {
      new __RESPONSE.CREATED({
         message: "Duyệt đánh giá thành công!",
         metadata: await duyetReview(req),
         request: req,
      }).send(res);
   },
   deleteReview: async (req, res, next) => {
      new __RESPONSE.DELETE({
         message: "Xóa đánh giá thành công!",
         metadata: await deleteReview(req),
         request: req,
      }).send(res);
   },
   updateReview: async (req, res, next) => {
      new __RESPONSE.UPDATE({
         message: "Cập nhật đánh giá thành công!",
         metadata: await updateReview(req),
         request: req,
      }).send(res);
   },
};

module.exports = __REVIEW_CONTROLLER;
