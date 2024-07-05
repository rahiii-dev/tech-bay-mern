import { body, param } from 'express-validator';

export const validateBrandCreation = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isString().withMessage('Name must be a string'),
  body('description')
    .optional()
    .isString().withMessage('Description must be a string'),
];

export const validateBrandEdit = [
  param('id')
    .isMongoId().withMessage('Invalid brand ID'),
  body('name')
    .optional()
    .isString().withMessage('Name must be a string'),
  body('description')
    .optional()
    .isString().withMessage('Description must be a string'),
];

export const validateBrandId = [
  param('id')
    .isMongoId().withMessage('Invalid brand ID'),
];
