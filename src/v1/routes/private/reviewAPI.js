const express = require("express");
const rootRouter = express.Router();
const __RESPONSE = require("../../core/errorResponse");
const __REVIEW_CONTROLLER__ = require("../../controllers/reviewController");
const asyncHandler = require("../../middlewares/handleError");

rootRouter
   .get("/getall", asyncHandler(__REVIEW_CONTROLLER__.getAllReviews))
   .put("/duyet", asyncHandler(__REVIEW_CONTROLLER__.duyetReview))
   .delete("/delete", asyncHandler(__REVIEW_CONTROLLER__.deleteReview))
   .put("/update", asyncHandler(__REVIEW_CONTROLLER__.updateReview));

module.exports = rootRouter;
