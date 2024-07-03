import { body, query } from "express-validator";

export const loginValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required"),
];

export const registrationValidator = [
    body("fullName")
      .trim()
      .notEmpty()
      .withMessage("Full name is required"),
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Please provide a valid email"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ];

  export const otpValidator = [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required"),
    body("otp")
      .trim()
      .notEmpty()
      .withMessage("OTP is required"),
  ];

  export const resendOtpValidator = [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
  ];


export const googleAuthValidator = [
  query('code')
    .trim()
    .notEmpty()
    .withMessage('Authorization code is required'),
];

  
  