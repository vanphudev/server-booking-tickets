const express = require("express");
const rootRouter = express.Router();
const __OFFICE_IMAGE_CONTROLLER__ = require("../../controllers/officeImageController");
const asyncHandler = require("../../middlewares/handleError");

const {
   validateCreateOfficeImage,
   validateUpdateOfficeImage,
   validateOfficeImageWithByIDToQuery,
} = require("../../middlewares/validates/officeImageValidates");

const {createUploadMiddleware} = require("../../utils/uploadImages");

const __FOLDER__ = "office_images";
const __MAX_FILES__ = 10;

const officeImageUpload = createUploadMiddleware({
   maxFiles: __MAX_FILES__,
   customFolder: __FOLDER__,
});

rootRouter
   .get("/getall", asyncHandler(__OFFICE_IMAGE_CONTROLLER__.getAllOfficeImages))
   .get("/getalldeleted", asyncHandler(__OFFICE_IMAGE_CONTROLLER__.findAllDeletedOfficeImages))
   .put(
      "/update",
      validateUpdateOfficeImage,
      asyncHandler(__OFFICE_IMAGE_CONTROLLER__.getOfficeByOfficeId),
      officeImageUpload,
      validateUpdateOfficeImage,
      asyncHandler(__OFFICE_IMAGE_CONTROLLER__.updateOfficeImage)
   )
   .get("/getbyid", validateOfficeImageWithByIDToQuery, asyncHandler(__OFFICE_IMAGE_CONTROLLER__.getOfficeImageById))
   .post(
      "/create",
      validateCreateOfficeImage,
      asyncHandler(__OFFICE_IMAGE_CONTROLLER__.getOfficeByOfficeId),
      officeImageUpload,
      validateCreateOfficeImage,
      asyncHandler(__OFFICE_IMAGE_CONTROLLER__.createOfficeImage)
   )
   .delete("/delete", validateOfficeImageWithByIDToQuery, asyncHandler(__OFFICE_IMAGE_CONTROLLER__.deleteOfficeImage));

module.exports = rootRouter;
