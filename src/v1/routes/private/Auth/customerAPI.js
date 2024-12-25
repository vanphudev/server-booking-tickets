const express = require("express");
const customerRouter = express.Router();
const asyncHandler = require("../../../middlewares/handleError");
const __CUSTOMER_CONTROLLER__ = require("../../../controllers/customerController");
const { validateCustomer } = require("../../../middlewares/validates/customerValidates");

customerRouter.post("/signout", asyncHandler(__CUSTOMER_CONTROLLER__.logOut));
customerRouter.post("/logOut", asyncHandler(__CUSTOMER_CONTROLLER__.logOut));
customerRouter.post("/getById", validateCustomer, asyncHandler(__CUSTOMER_CONTROLLER__.getCustomerById));

module.exports = customerRouter;
