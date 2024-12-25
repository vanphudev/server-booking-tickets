const {body} = require("express-validator");

const validateSignUpCus = [
   body("phone").notEmpty().withMessage("Phone is required"),
   body("phone").isLength({min: 10, max: 15}).withMessage("Phone must be at least 10 characters."),
   body("email").notEmpty().withMessage("Email is required"),
   body("email").isEmail().withMessage("Email is invalid"),
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
   body("gender").notEmpty().withMessage("Gender is required !"),
   body("name").notEmpty().withMessage("Full name is required !"),
];

module.exports = {
   validateSignUpCus,
};
