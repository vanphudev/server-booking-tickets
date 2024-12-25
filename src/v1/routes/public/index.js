"use strict";
const express = require("express");
const publicRouter = express.Router();

publicRouter.use("/provinces", require("./provinceAPI"));
publicRouter.use("/districts", require("./districtAPI"));
publicRouter.use("/office", require("./officeAPI"));
publicRouter.use("/wards", require("./wardAPI"));
publicRouter.use("/way", require("./wayAPI"));
publicRouter.use("/employee/auth", require("./Auth/employeeAPI"));
publicRouter.use("/customer/auth", require("./Auth/customerAPI"));
publicRouter.use("/employee-type", require("./employeeTypeAPI"));
publicRouter.use("/vehicle", require("./vehicleAPI"));
publicRouter.use("/route", require("./routesAPI"));
publicRouter.use("/article", require("./articleAPI"));
publicRouter.use("/trip", require("./routesAPI"));
publicRouter.use("/booking", require("./bookingAPI"));
publicRouter.use("/contact", require("./contactAPI"));
publicRouter.use("/voucher", require("./voucherAPI"));
publicRouter.use("/review", require("./reviewAPI"));

module.exports = publicRouter;
