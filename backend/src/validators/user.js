 
/* eslint-disable max-len */
const { body, param } = require('express-validator');
const { sanitizeBodyHelper } = require('./validationHandler');

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const allowedFields = [
  'firstName',
  'lastName',
  'userName',
  'email',
  'mobileNumber',
  'password',
  'roleId',
  'vendorId'
];

const stringField = (field, label, isOptional = false, min = 3, max = 50) => {
  const validator = body(field)
    .isString().withMessage(`${label} should be a string`)
    .isLength({ min, max }).withMessage(`${label} should be ${min} to ${max} characters long`);

  return isOptional ? validator.optional() : validator.notEmpty().withMessage(`${label} is required`);
};

const emailField = (isOptional = false) => {
  const validator = body('email')
    .isEmail().withMessage('Please enter a valid email');

  return isOptional ? validator.optional() : validator.notEmpty().withMessage('Email is required');
};

const intField = (field, label, isOptional = false) => {
  const validator = body(field)
    .isInt().withMessage(`${label} should be numeric`);
  return isOptional ? validator.optional() : validator.notEmpty().withMessage(`${label} is required`);
};

const mobileField = (isOptional = false) => {
  const validator = body('mobileNumber')
    .isString().withMessage('Mobile number must be a string')
    .isLength({ min: 10, max: 10 }).withMessage('Mobile number must be exactly 10 digits');

  return isOptional ? validator.optional() : validator.notEmpty().withMessage('Mobile Number is required');
};

const passwordField = (isOptional = false) => {
  const validator = body('password')
    .matches(passwordRegex)
    .withMessage(
      'Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a digit, and a special character',
    );

  return isOptional ? validator.optional() : validator.notEmpty().withMessage('Password is required');
};

const sanitizeBody = sanitizeBodyHelper(allowedFields);

exports.validateAddUser = [
  sanitizeBody,
  stringField('firstName', 'First name'),
  stringField('lastName', 'Last name'),
  stringField('userName', 'User name'),
  emailField(),
  mobileField(),
  passwordField(),
  intField('roleId', 'Role ID'),

  body('vendorId')
    .optional()
    .isInt().withMessage('vendor id should be a number'),
];

exports.validateUpdateUser = [
  sanitizeBody,
  param('id')
    .notEmpty().withMessage('Id is required')
    .isInt().withMessage('Id should be a number'),
  stringField('firstName', 'First name', true),
  stringField('lastName', 'Last name', true),
  stringField('userName', 'User name', true),
  emailField(true),
  mobileField(true),
  intField('roleId', 'Role ID', true),
];

exports.validateUpdatePassword = [
  emailField(false),
  body('newPassword')
    .notEmpty().withMessage('New Password is required')
    .matches(passwordRegex).withMessage(
      'Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a digit, and a special character',
    ),
  body('otp')
    .notEmpty().withMessage('OTP is required')
    .isInt().withMessage('OTP should be a number'),
];
