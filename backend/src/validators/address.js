const { body, param } = require('express-validator');
const { sanitizeBodyHelper } = require('./validationHandler');

const allowedFields = [
  'id', 'customerId', 'mainAddress1', 'mainAddress2', 'landmark',
  'latitude', 'longitude','mobileNumber','name',
];

const sanitizeCreateBody = sanitizeBodyHelper(allowedFields);
const sanitizeUpdateBody = sanitizeBodyHelper(allowedFields);

const fieldValidators = {
  customerId: body('customerId')
    .notEmpty().withMessage('Customer ID is required')
    .isInt().withMessage('Customer ID must be an integer'),

  mainAddress1: body('mainAddress1')
    .notEmpty().withMessage('Company name, Building is required')
    .isString().withMessage('Company name, Building must be a string'),

  mainAddress2: body('mainAddress2')
    .optional()
    .isString().withMessage('Tower must be a string'),

  mobileNumber: body('mobileNumber')
    .notEmpty().withMessage('Mobile Number must not be empty')
    .isString().withMessage('mobileNumber must be a string'),
  
  landmark: body('landmark')
    .optional()
    .isString().withMessage('landmark must be a string'),

};

const validateAddAddress = [
  sanitizeCreateBody,
  fieldValidators.customerId,
  fieldValidators.mainAddress1,
  fieldValidators.mainAddress2,
  fieldValidators.mobileNumber,
  fieldValidators.landmark,
];

const validateUpdateAddress = [
  sanitizeUpdateBody,
  param('id')
    .notEmpty().withMessage('Address ID is required')
    .isInt().withMessage('Address ID must be an integer'),
  fieldValidators.customerId.optional(),
  fieldValidators.mainAddress1.optional(),
  fieldValidators.mainAddress2.optional(),
  fieldValidators.mobileNumber.optional(),
  fieldValidators.landmark.optional(),
];

module.exports = {
  validateAddAddress,
  validateUpdateAddress,
};
