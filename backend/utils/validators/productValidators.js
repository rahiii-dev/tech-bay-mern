import { body, param } from "express-validator";

export const validateProductCreation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("price").isNumeric().withMessage("Price must be a number"),
  body("stock").isNumeric().withMessage("Stock must be a number"),
  body("category").isMongoId().withMessage("Invalid category ID"),
  body("brand").notEmpty().withMessage("Brand is required").isMongoId().withMessage("Invalid brand ID")
];

export const validateProductEdit = [
  param("id").isMongoId().withMessage("Invalid product ID"),
  body("name").optional().notEmpty().withMessage("Name must not be empty"),
  body("description").optional().notEmpty().withMessage("Description must not be empty"),
  body("price").optional().isNumeric().withMessage("Price must be a number"),
  body("stock").optional().isNumeric().withMessage("Stock must be a number"),
  body("images").optional().isArray().withMessage("Images must be an array"),
  body("category").optional().notEmpty().withMessage("Category must not be empty"),
  body("brand").optional().notEmpty().withMessage("Brand must not be empty")
];

export const validateProductId = [
  param("id").isMongoId().withMessage("Invalid product ID")
];
