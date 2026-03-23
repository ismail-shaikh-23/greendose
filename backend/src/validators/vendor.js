/* eslint-disable max-len */
/* eslint-disable no-undef */
const { body, param } = require('express-validator');
const { ValidationError } = require('../../utils/customError');
const { sanitizeBodyHelper } = require('./validationHandler');

const allowedFields = [
  'type',
  'organizationName',
  'licenseId',
  'addressName',
  'addressStreet',
  'addressZipcode',
  'addressState',
  'addressCity',
  'addressCountry',
  'rejectionReason',
  'email',
  'userName',
  'mobileNumber',
  'password'
];
const updateVendorStatusFields = ['status', 'rejectionReason'];
const vendorTypes = ['cosmetic store', 'pharmacy', 'other'];
const vendorStatuses = ['approved', 'pending', 'rejected'];

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


const stringField = (field, label, optional = false) => {
  const validator = body(field).isString().withMessage(`${label} must be a string`);
  return optional ? validator.optional() : validator.notEmpty().withMessage(`${label} is required`);
};

const intField = (field, label, optional = false) => {
  const validator = body(field).isInt().withMessage(`${label} should be a number`);
  return optional ? validator.optional() : validator.notEmpty().withMessage(`${label} is required`);
};


exports.validateAddVendor = [
  sanitizeBodyHelper(allowedFields),
  body('type')
    .isIn(vendorTypes).withMessage('Invalid type value'),
  stringField('organizationName', 'Organization name'),
  intField('licenseId', 'License ID'),
  stringField('addressName', 'Address name'),
  stringField('addressStreet', 'Address street'),
  stringField('addressZipcode', 'Address zipcode'),
  stringField('addressState', 'Address state'),
  stringField('addressCity', 'Address city'),
  stringField('addressCountry', 'Address country'),
  stringField('email', 'Email'),
  stringField('userName', 'User Name'),
  stringField('mobileNumber', 'Mobile Number'),

  body('password')
    .notEmpty()
    .withMessage("Password is required")
    .matches(passwordRegex)
    .withMessage(
      'Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a digit, and a special character',
    )
];

exports.validateRegisterVendor = [
  sanitizeBodyHelper(allowedFields),
  body('type')
    .isIn(vendorTypes).withMessage('Invalid type value'),
  stringField('organizationName', 'Organization name'),
  intField('licenseId', 'License ID'),
  stringField('addressName', 'Address name'),
  stringField('addressStreet', 'Address street'),
  stringField('addressZipcode', 'Address zipcode'),
  stringField('addressState', 'Address state'),
  stringField('addressCity', 'Address city'),
  stringField('addressCountry', 'Address country'),
  stringField('email', 'Email'),
  stringField('userName', 'User Name'),
  stringField('mobileNumber', 'Mobile Number'),
];

exports.validateUpdateVendor = [
  sanitizeBodyHelper(allowedFields),
  param('id')
    .notEmpty().withMessage('Id is required')
    .isInt().withMessage('Id should be a number'),
  body('type').optional()
    .isIn(vendorTypes).withMessage('Invalid type value'),
  stringField('organizationName', 'Organization name', true),
  intField('licenseId', 'License ID', true),
  stringField('addressName', 'Address name', true),
  stringField('addressStreet', 'Address street', true),
  stringField('addressZipcode', 'Address zipcode', true),
  stringField('addressState', 'Address state', true),
  stringField('addressCity', 'Address city', true),
  stringField('addressCountry', 'Address country', true),
  stringField('email', 'Email', true),
  stringField('userName', 'User Name', true),
  stringField('mobileNumber', 'Mobile Number', true),
];

exports.validateUpdateVendorStatus = [
  sanitizeBodyHelper(updateVendorStatusFields),
  param('id').notEmpty().withMessage('Id is required').isInt().withMessage('Id should be a number'),
  body('status').notEmpty().withMessage('Status is required').isIn(vendorStatuses).withMessage('Invalid status value'),
  body('rejectionReason').custom((value, { req }) => {
    if (req.body.status === 'rejected') {
      if (!value || typeof value !== 'string' || value.trim() === '') {
        throw new ValidationError('Rejection reason is required when status is rejected');
      }
    } else if (req.body.status === 'approved' && value) {
      throw new ValidationError('Rejection reason is not required when status is approved');
    }
    return true;
  }),
];