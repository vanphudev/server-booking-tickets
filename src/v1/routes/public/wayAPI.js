const express = require("express");
const rootRouter = express.Router();
const __RESPONSE = require("../../core/errorResponse");
const __WAY_CONTROLLER__ = require("../../controllers/wayController");
const asyncHandler = require("../../middlewares/handleError");

rootRouter.get("/getall", asyncHandler(__WAY_CONTROLLER__.getAllWays));

module.exports = rootRouter;
