const express = require("express");
const rootRouter = express.Router();
const asyncHandler = require("../../middlewares/handleError");
const {validateDistrictById} = require("../../middlewares/validates/wardValidate");
const __WARD_CONTROLLER__ = require("../../controllers/wardController");

rootRouter.get("/getall", asyncHandler(__WARD_CONTROLLER__.getWards));
rootRouter.get(
   "/getbydistrictid/:districtId",
   validateDistrictById,
   asyncHandler(__WARD_CONTROLLER__.getWardsByIdDistrict)
);

module.exports = rootRouter;
