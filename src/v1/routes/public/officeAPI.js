const express = require("express");
const rootRouter = express.Router();
const __RESPONSE = require("../../core/errorResponse");
const __OFFICE_CONTROLLER__ = require("../../controllers/officeController");
const asyncHandler = require("../../middlewares/handleError");

rootRouter
   .get("/getall", asyncHandler(__OFFICE_CONTROLLER__.getAllOffices))

module.exports = rootRouter;
