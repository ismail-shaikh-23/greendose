/* eslint-disable max-len */
const { body, param } = require('express-validator');
const { sanitizeBodyHelper } = require('./validationHandler');

const allowedFields = ['id', 'firstName', 'lastName', 'userName', 'email', 'mobileNumber', 'roleId'];

const sanitizeBody = sanitizeBodyHelper(allowedFields);

const stringField = (field, displayName, min = 3, max = 50, isOptional = false) => {
  let validator = body(field)
    .isString().withMessage(`${displayName} should be a string`)
    .isLength({ min, max }).withMessage(`${displayName} should be ${min} to ${max} characters long`);

  return isOptional ? validator.optional() : validator.notEmpty().withMessage(`${displayName} is required`);
};

const emailField = (isOptional = false) => {
  let validator = body('email')
    .isEmail().withMessage('Please enter a valid email');

  return isOptional ? validator.optional() : validator.notEmpty().withMessage('Email is required');
};

const mobileField = (isOptional = false) => {
  let validator = body('mobileNumber')
    .isString().withMessage('Mobile number must be a string')
    .isLength({ min: 10, max: 10 }).withMessage('Mobile number must be exactly 10 digits');

  return isOptional ? validator.optional() : validator.notEmpty().withMessage('Mobile Number is required');
};

exports.validateAddCustomer = [
  sanitizeBody,
  stringField('firstName', 'First name', true),
  stringField('lastName', 'Last name', true),
  stringField('userName', 'User name', true),
  emailField(true),
  mobileField(),
  body('roleId')
    .notEmpty().withMessage('Role id is required')
    .isInt().withMessage('Role id should be a number'),
];

exports.validateUpdateCustomer = [
  sanitizeBody,
  param('id')
    .notEmpty().withMessage('Id is required')
    .isNumeric().withMessage('Id should be a number'),
  stringField('firstName', 'First name', 3, 50, true),
  stringField('lastName', 'Last name', 3, 50, true),
  stringField('userName', 'User name', 3, 50, true),
  emailField(true),
  mobileField(true),
];
