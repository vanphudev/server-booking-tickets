const express = require("express");
const customerRouter = express.Router();
const asyncHandler = require("../../../middlewares/handleError");
const __CUSTOMER_CONTROLLER__ = require("../../../controllers/customerController");

const {validateSignIn} = require("../../../middlewares/validates/validateSignInCus");
const {validateSignUpCus} = require("../../../middlewares/validates/validateSignUpCus");
const {validateRefreshToken} = require("../../../middlewares/validates/validateRefreshTokenCus");

customerRouter.post("/signin", validateSignIn, asyncHandler(__CUSTOMER_CONTROLLER__.signIn));
customerRouter.post("/signup", validateSignUpCus, asyncHandler(__CUSTOMER_CONTROLLER__.signUp));
customerRouter.post("/refresh-token", validateRefreshToken, asyncHandler(__CUSTOMER_CONTROLLER__.handlerRefreshToken));

module.exports = customerRouter;
