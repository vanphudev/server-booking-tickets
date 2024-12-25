const express = require("express");
const rootRouter = express.Router();
const __RESPONSE = require("../../core/errorResponse");
const __REVIEW_CONTROLLER__ = require("../../controllers/reviewController");
const asyncHandler = require("../../middlewares/handleError");

rootRouter
   .get("/getbyrouteid/:route_id", asyncHandler(__REVIEW_CONTROLLER__.getReviewByRouteId))
   .post("/create", asyncHandler(__REVIEW_CONTROLLER__.createReview));

module.exports = rootRouter;
