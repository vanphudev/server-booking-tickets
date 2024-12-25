const {body} = require("express-validator");

const validateRefreshToken = [
   body("customerId").notEmpty().withMessage("Customer ID is required"),
   body("refreshToken").notEmpty().withMessage("Refresh token is required"),
];

module.exports = {
   validateRefreshToken,
};
