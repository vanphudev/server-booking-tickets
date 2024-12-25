const express = require("express");
const rootRouter = express.Router();
const __RESPONSE = require("../../core/errorResponse");
const __OFFICE_CONTROLLER__ = require("../../controllers/officeController");
const asyncHandler = require("../../middlewares/handleError");
const {
   validateCreateOffice,
   validateUpdateOffice,
   validateOfficeWithByIDToQuery,
   validateOfficeWithByIDToParams,
} = require("../../middlewares/validates/officeValidates");

rootRouter
   .get("/getalldeleted", asyncHandler(__OFFICE_CONTROLLER__.findAllDeletedOffice))
   .put("/update", validateUpdateOffice, asyncHandler(__OFFICE_CONTROLLER__.updateOffice))
   .get("/getbyid", validateOfficeWithByIDToQuery, asyncHandler(__OFFICE_CONTROLLER__.getOfficeById))
   .post("/create", validateCreateOffice, asyncHandler(__OFFICE_CONTROLLER__.createOffice))
   .delete("/delete/:officeId", validateOfficeWithByIDToParams, asyncHandler(__OFFICE_CONTROLLER__.deleteOffice));

module.exports = rootRouter;
