const express = require("express");
const rootRouter = express.Router();
const __RESPONSE = require("../../core/errorResponse");
const __TYPE_EMPLOYEE_CONTROLLER = require("../../controllers/employeeTypeController");
const asyncHandler = require("../../middlewares/handleError");

rootRouter
   .get("/getall", asyncHandler(__TYPE_EMPLOYEE_CONTROLLER.getAllTypeEmployee))


module.exports = rootRouter;
