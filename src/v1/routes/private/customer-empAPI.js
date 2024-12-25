const express = require("express");
const rootRouter = express.Router();
const __RESPONSE = require("../../core/errorResponse");
const asyncHandler = require("../../middlewares/handleError");
const __CUSTOMER_CONTROLLER = require("../../controllers/customerController");

rootRouter.get("/getall", asyncHandler(__CUSTOMER_CONTROLLER.getAllCustomer));
rootRouter.post("/lockaccount", asyncHandler(__CUSTOMER_CONTROLLER.lockAccountCustomer));
rootRouter.post("/unlockaccount", asyncHandler(__CUSTOMER_CONTROLLER.unlockAccountCustomer));
rootRouter.get("/count", asyncHandler(__CUSTOMER_CONTROLLER.countCustomer));
module.exports = rootRouter;
