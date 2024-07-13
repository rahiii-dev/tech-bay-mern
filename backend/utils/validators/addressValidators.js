import { body, param } from 'express-validator';

export const addAddressValidator = [
  body('city').notEmpty().withMessage('City is required'),
  body('state').notEmpty().withMessage('State is required'),
  body('zipCode').notEmpty().withMessage('Zip Code is required'),
  body('country').notEmpty().withMessage('Country is required')
];

export const updateAddressValidator = [
    param('id').isMongoId().withMessage('Invalid address ID'),
    body('street').optional().notEmpty().withMessage('Street is required if provided'),
    body('city').optional().notEmpty().withMessage('City is required if provided'),
    body('state').optional().notEmpty().withMessage('State is required if provided'),
    body('zipCode').optional().notEmpty().withMessage('Zip Code is required if provided'),
    body('country').optional().notEmpty().withMessage('Country is required if provided')
 ];
