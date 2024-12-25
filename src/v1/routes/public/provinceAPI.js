const express = require("express");
const provinceRouter = express.Router();
const asyncHandler = require("../../middlewares/handleError");
const __PROVINCE_CONTROLLER__ = require("../../controllers/provinceController");

provinceRouter.get("/getall", asyncHandler(__PROVINCE_CONTROLLER__.getProvinces));
provinceRouter.get("/getbyid/:provinceId", asyncHandler(__PROVINCE_CONTROLLER__.getProvinceById));

module.exports = provinceRouter;
