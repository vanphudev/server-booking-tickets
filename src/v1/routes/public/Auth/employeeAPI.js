const express = require("express");
const employeeRouter = express.Router();
const asyncHandler = require("../../../middlewares/handleError");
const __EMPLOYEE_CONTROLLER__ = require("../../../controllers/employeeController");
const {validateSignIn} = require("../../../middlewares/validates/validateSignIn");
const {validateRefreshToken} = require("../../../middlewares/validates/validateRefreshToken");
const {
   validateEmployee,
   validateCreateEmployee,
   validateUpdateEmployee,
   validateDeleteEmployee,
} = require("../../../middlewares/validates/employeeValidates");
employeeRouter.post("/signin", validateSignIn, asyncHandler(__EMPLOYEE_CONTROLLER__.signIn));
employeeRouter.post("/refresh-token", validateRefreshToken, asyncHandler(__EMPLOYEE_CONTROLLER__.handlerRefreshToken));

employeeRouter.get("/getall", asyncHandler(__EMPLOYEE_CONTROLLER__.getAllEmployee));
employeeRouter.put("/update/:employeeId", validateUpdateEmployee, asyncHandler(__EMPLOYEE_CONTROLLER__.updateEmployee));
employeeRouter.get("/getbyid", validateEmployee, asyncHandler(__EMPLOYEE_CONTROLLER__.getEmployeeByIdE));
employeeRouter.post("/create", validateCreateEmployee, asyncHandler(__EMPLOYEE_CONTROLLER__.createEmployee));
employeeRouter.delete("/delete", validateDeleteEmployee, asyncHandler(__EMPLOYEE_CONTROLLER__.deleteEmployee));
module.exports = employeeRouter;
