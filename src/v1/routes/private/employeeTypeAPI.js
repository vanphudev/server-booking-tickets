const express = require("express");
const rootRouter = express.Router();
const __RESPONSE = require("../../core/errorResponse");
const __TYPE_EMPLOYEE_CONTROLLER = require("../../controllers/employeeTypeController");
const asyncHandler = require("../../middlewares/handleError");

rootRouter
   .post("/create", asyncHandler(__TYPE_EMPLOYEE_CONTROLLER.createTypeEmployee))
   .put("/update", asyncHandler(__TYPE_EMPLOYEE_CONTROLLER.updateTypeEmployee))
   .delete("/delete/:employee_type_id", asyncHandler(__TYPE_EMPLOYEE_CONTROLLER.deleteTypeEmployee))


module.exports = rootRouter;
