"use strict";

const __RESPONSE = require("../../core");
const {createTypeCustomer} = require("../../services/typeCustomerService");

const __TYPE_CUSTOMER_CONTROLLER = {
   createTypeCustomer: async (req, res, next) => {
      new __RESPONSE.CREATED({
         message: "Create new type customer",
         metadata: await createTypeCustomer(req),
         request: req,
      }).send(res);
   },
   updateTypeCustomer: async (req, res, next) => {
      try {
         new __RESPONSE.PUT({
            message: "Update type customer",
            metadata: await updateTypeCustomer(req),
            request: req,
         }).send(res);
      } catch (error) {
         next(error);
      }
   },
};

module.exports = __TYPE_CUSTOMER_CONTROLLER;
