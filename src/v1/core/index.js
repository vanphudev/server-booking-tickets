"use strict";

const errorResponse = require("./errorResponse");
const successResponse = require("./successResponse");

module.exports = {
   ...errorResponse,
   ...successResponse,
};
