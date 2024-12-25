const express = require("express");
const rootRouter = express.Router();
const __RESPONSE = require("../../core/errorResponse");
const __WAY_CONTROLLER__ = require("../../controllers/wayController");
const asyncHandler = require("../../middlewares/handleError");
const {
   validateCreateWay,
   validateUpdateWay,
   validateWayWithByIDToQuery,
} = require("../../middlewares/validates/wayValidates");

rootRouter
   .put("/update", validateUpdateWay, asyncHandler(__WAY_CONTROLLER__.updateWay))
   .get("/getbyid", validateWayWithByIDToQuery, asyncHandler(__WAY_CONTROLLER__.getWayById))
   .post("/create", validateCreateWay, asyncHandler(__WAY_CONTROLLER__.createWay))
   .delete("/delete", validateWayWithByIDToQuery, asyncHandler(__WAY_CONTROLLER__.deleteWay));

module.exports = rootRouter;
