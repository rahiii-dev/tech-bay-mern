import { body } from "express-validator";

export const validateCouponData = [
  body("code").trim().notEmpty().withMessage("Code is required"),
  body("discount").isNumeric().withMessage("Discount must be a number"),
  body("expiryDate").isISO8601().withMessage("Invalid expiry date"),
  body("minAmount").isNumeric().withMessage("Minimum amount must be a number"),
  body("maxAmount").isNumeric().withMessage("Maximum amount must be a number"),
];
