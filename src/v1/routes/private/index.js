"use strict";
const express = require("express");
const privateRouter = express.Router();

// Middleware authentication
const employeeAuth = require("../../middlewares/Auth/authUtils").authentication;
const customerAuth = require("../../middlewares/Auth/authCusUtils").authentication;

// Router dành cho nhân viên
const employeeRouter = express.Router();
employeeRouter.use(employeeAuth);
privateRouter.use("/employee", employeeRouter);
employeeRouter.use("/type-customer", require("./typeCustomerAPI"));
employeeRouter.use("/type-vehicle", require("./typeVehicleAPI"));
employeeRouter.use("/vehicle", require("./vehicleAPI"));
employeeRouter.use("/vehicleImage", require("./vehicleImageAPI"));
employeeRouter.use("/vouchers", require("./voucherAPI"));
employeeRouter.use("/type-article", require("./typeArticleAPI"));
employeeRouter.use("/article", require("./articleAPI"));
employeeRouter.use("/articleimage", require("./articleImageAPI"));
employeeRouter.use("/type-customer", require("./typeCustomerAPI"));
employeeRouter.use("/office", require("./officeAPI"));
employeeRouter.use("/way", require("./wayAPI"));
employeeRouter.use("/officeimage", require("./officeImageAPI"));
employeeRouter.use("/map-vehicle-layout", require("./mapVehicleLayoutAPI"));
employeeRouter.use("/map-vehicle-seat", require("./mapVehicleSeatAPI"));
employeeRouter.use("/role", require("./roleAPI"));
employeeRouter.use("/payment", require("./paymentAPI"));
employeeRouter.use("/group", require("./groupAPI"));
employeeRouter.use("/role-group", require("./roleGroupAPI"));
employeeRouter.use("/employee/auth", require("./Auth/employeeAPI"));
employeeRouter.use("/employee-type", require("./employeeTypeAPI"));
employeeRouter.use("/customer-employee", require("./customer-empAPI"));
employeeRouter.use("/route", require("./routeAPI"));
employeeRouter.use("/trips", require("./tripsServiceAPI"));
employeeRouter.use("/review", require("./reviewAPI"));
employeeRouter.use("/refund", require("./refund_adminAPI"));
employeeRouter.use("/report", require("./reportAPI"));

// Router dành cho khách hàng
const customerRouter = express.Router();
customerRouter.use(customerAuth);
privateRouter.use("/customer", customerRouter);
customerRouter.use("/auth", require("./Auth/customerAPI"));
customerRouter.use("/profile", require("./customerAPI"));
customerRouter.use("/tickets", require("./ticketsAPI"));
customerRouter.use("/refund", require("./refundAPI"));

module.exports = privateRouter;
