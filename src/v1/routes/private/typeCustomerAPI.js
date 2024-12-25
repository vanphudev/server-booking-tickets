const express = require("express");
const rootRouter = express.Router();

const __TYPE_CUSTOMER_CONTROLLER = require("../../controllers/customerTypeController");
const asyncHandler = require("../../middlewares/handleError");

rootRouter.post("/create", asyncHandler(__TYPE_CUSTOMER_CONTROLLER.createTypeCustomer));

module.exports = rootRouter;
