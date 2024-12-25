const {body} = require("express-validator");

const validateSignIn = [
   body("username").notEmpty().withMessage("Username is required"),
   body("username").isLength({min: 6}).withMessage("Username must be at least 6 characters."),
   body("password").notEmpty().withMessage("Password is required"),
   body("password")
      .isLength({min: 6})
      .withMessage("Password must be at least 6 characters.")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least 1 uppercase letter.")
      .matches(/[a-z]/)
      .withMessage("Password must contain at least 1 lowercase letter.")
      .matches(/[0-9]/)
      .withMessage("Password must contain at least 1 number.")
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage("Password must contain at least 1 special character."),
];

module.exports = {
   validateSignIn,
};
