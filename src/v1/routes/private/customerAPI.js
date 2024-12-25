const express = require("express");
const rootRouter = express.Router();
const __RESPONSE = require("../../core/errorResponse");
const asyncHandler = require("../../middlewares/handleError");
const __CUSTOMER_CONTROLLER = require("../../controllers/customerController");
const {
   validateUpdateCustomer,
   validateResetPassword,
   validateUpdateAddress,
} = require("../../middlewares/validates/customerValidates");

rootRouter
   .put("/updateprofile", validateUpdateCustomer, asyncHandler(__CUSTOMER_CONTROLLER.updateProfile))
   .put("/updateaddress", validateUpdateAddress, asyncHandler(__CUSTOMER_CONTROLLER.updateAddress))
   .put("/resetpassword", validateResetPassword, asyncHandler(__CUSTOMER_CONTROLLER.resetPassword));

module.exports = rootRouter;
