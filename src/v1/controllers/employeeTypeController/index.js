"use strict";

const __RESPONSE = require("../../core");
const { getAllTypeEmployee } = require("../../services/employeeTypeService");

const __TYPE_EMPLOYEE_CONTROLLER = {
   getAllTypeEmployee: async (req, res, next) => {
      new __RESPONSE.GET({
         message: "List of all employee types",
         metadata: await getAllTypeEmployee(),
         request: req,
      }).send(res);
   },
};

module.exports = __TYPE_EMPLOYEE_CONTROLLER;
