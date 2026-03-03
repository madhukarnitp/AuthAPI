const { body } = require("express-validator");

const signupValidator = [
  body("fullname")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3, max: 30 })
    .withMessage("Name must be 3–30 characters"),

  body("phone")
    .trim()
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone Number should have 10 Digits."),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6, max: 20 })
    .withMessage("Password must be 6–20 characters")
    .matches(/^(?=.*[A-Z])(?=.*[0-9]).*$/)
    .withMessage(
      "Password must contain at least one capital letter and one number"
    )
];

const loginValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
];

module.exports = { signupValidator, loginValidator };