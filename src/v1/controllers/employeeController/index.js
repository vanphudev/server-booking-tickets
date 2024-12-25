"use strict";

const __RESPONSE = require("../../core");
const {logOut, signIn, handlerRefreshToken, getEmployeeById} = require("../../services/accessService/employeeAccess");
const {
   getAllEmployee,
   getEmployeeByIdE,
   createEmployee,
   updateEmployee,
   deleteEmployee,
   resetPassword,
   updateInfoEmployee,
   updatePassword,
   countEmployee,
} = require("../../services/employeeService");

const __EMPLOYEE_CONTROLLER = {
   logOut: async (req, res, next) => {
      new __RESPONSE.DELETE({
         message: "Logout successfully !",
         metadata: await logOut(req),
         request: req,
      }).send(res);
   },
   signIn: async (req, res, next) => {
      new __RESPONSE.CREATED({
         message: "Login successfully !",
         metadata: await signIn(req),
         request: req,
      }).send(res);
   },
   handlerRefreshToken: async (req, res, next) => {
      new __RESPONSE.CREATED({
         message: "Refresh token successfully !",
         metadata: await handlerRefreshToken(req),
         request: req,
      }).send(res);
   },

   getEmployeeById: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "Get employee successfully !",
         metadata: await getEmployeeById(req),
         request: req,
      }).send(res);
   },

   getAllEmployee: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "List of all employees",
         metadata: await getAllEmployee(),
         request: req,
      }).send(res);
   },

   getEmployeeByIdE: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "Employees information",
         metadata: await getEmployeeByIdE(req),
         request: req,
      }).send(res);
   },

   createEmployee: async (req, res, next) => {
      new __RESPONSE.CREATED({
         message: "Employee created",
         metadata: await createEmployee(req),
         request: req,
      }).send(res);
   },

   updateEmployee: async (req, res, next) => {
      new __RESPONSE.UPDATE({
         message: "Employee updated",
         metadata: await updateEmployee(req),
         request: req,
      }).send(res);
   },

   deleteEmployee: async (req, res, next) => {
      new __RESPONSE.DELETE({
         message: "Emplyee deleted",
         metadata: await deleteEmployee(req),
         request: req,
      }).send(res);
   },
   resetPassword: async (req, res, next) => {
      new __RESPONSE.UPDATE({
         message: "Reset password successfully !",
         metadata: await resetPassword(req),
         request: req,
      }).send(res);
   },
   updateInfoEmployee: async (req, res, next) => {
      new __RESPONSE.UPDATE({
         message: "Update employee information successfully !",
         metadata: await updateInfoEmployee(req),
         request: req,
      }).send(res);
   },
   updatePassword: async (req, res, next) => {
      new __RESPONSE.UPDATE({
         message: "Update password successfully !",
         metadata: await updatePassword(req),
         request: req,
      }).send(res);
   },
   countEmployee: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "Count of employees",
         metadata: await countEmployee(),
         request: req,
      }).send(res);
   },
};

module.exports = __EMPLOYEE_CONTROLLER;
