const express = require("express");
const rootRouter = express.Router();
const __RESPONSE = require("../../core/errorResponse");
const __CONTACT_CONTROLLER = require("../../controllers/contactController");
const asyncHandler = require("../../middlewares/handleError");

rootRouter.post("/create", asyncHandler(__CONTACT_CONTROLLER.createContact));

module.exports = rootRouter;
