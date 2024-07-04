import { body, param } from 'express-validator';

export const validateCategoryCreation = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isString().withMessage('Name must be a string'),
  body('description')
    .optional()
    .isString().withMessage('Description must be a string'),
];

export const validateCategoryEdit = [
  param('id')
    .isMongoId().withMessage('Invalid category ID'),
  body('name')
    .optional()
    .isString().withMessage('Name must be a string'),
  body('description')
    .optional()
    .isString().withMessage('Description must be a string'),
];

export const validateCategoryId = [
  param('id')
    .isMongoId().withMessage('Invalid category ID'),
];
