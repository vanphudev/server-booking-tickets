const {body} = require("express-validator");

const validateRefreshToken = [
   body("employeeId").notEmpty().withMessage("Employee ID is required"),
   body("refreshToken").notEmpty().withMessage("Refresh token is required"),
];

module.exports = {
   validateRefreshToken,
};
