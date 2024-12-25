const express = require("express");
const districtRouter = express.Router();
const asyncHandler = require("../../middlewares/handleError");
const __DISTRICT_CONTROLLER__ = require("../../controllers/districtController");

districtRouter.get("/getall", asyncHandler(__DISTRICT_CONTROLLER__.getDistricts));
districtRouter.get("/getbyprovinceid/:provinceId", asyncHandler(__DISTRICT_CONTROLLER__.getDistrictsByIdProvince));

module.exports = districtRouter;
