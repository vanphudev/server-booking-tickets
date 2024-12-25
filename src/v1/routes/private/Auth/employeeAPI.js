const express = require("express");
const employeeRouter = express.Router();
const asyncHandler = require("../../../middlewares/handleError");
const __EMPLOYEE_CONTROLLER__ = require("../../../controllers/employeeController");
const {
   validateEmployee,
   validateCreateEmployee,
   validateUpdateEmployee,
   validateDeleteEmployee,
} = require("../../../middlewares/validates/employeeValidates");

employeeRouter.get(
   "/get-employee-by-id/:employeeId",
   validateEmployee,
   asyncHandler(__EMPLOYEE_CONTROLLER__.getEmployeeById)
);

employeeRouter.post("/signout", asyncHandler(__EMPLOYEE_CONTROLLER__.logOut));

employeeRouter.get("/getall", asyncHandler(__EMPLOYEE_CONTROLLER__.getAllEmployee));

employeeRouter.put("/update", validateUpdateEmployee, asyncHandler(__EMPLOYEE_CONTROLLER__.updateEmployee));
employeeRouter.get("/getbyid", validateEmployee, asyncHandler(__EMPLOYEE_CONTROLLER__.getEmployeeByIdE));
employeeRouter.post("/create", validateCreateEmployee, asyncHandler(__EMPLOYEE_CONTROLLER__.createEmployee));
employeeRouter.delete(
   "/delete/:employee_id",
   validateDeleteEmployee,
   asyncHandler(__EMPLOYEE_CONTROLLER__.deleteEmployee)
);
employeeRouter.post("/resetpassword", asyncHandler(__EMPLOYEE_CONTROLLER__.resetPassword));
employeeRouter.put("/update-info", asyncHandler(__EMPLOYEE_CONTROLLER__.updateInfoEmployee));
employeeRouter.put("/update-password", asyncHandler(__EMPLOYEE_CONTROLLER__.updatePassword));
employeeRouter.get("/count", asyncHandler(__EMPLOYEE_CONTROLLER__.countEmployee));

module.exports = employeeRouter;
