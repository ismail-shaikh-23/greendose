const { body, param } = require('express-validator');
const { sanitizeBodyHelper } = require('./validationHandler');

const allowedFields = ['name', 'description'];

const sanitizeBody = sanitizeBodyHelper(allowedFields);

const stringField = (field, label, isOptional = false) => {
  let validator = body(field)
    .isString().withMessage(`${label} must be a string`);

  return isOptional
    ? validator.optional()
    : validator.notEmpty().withMessage(`${label} is required`);
};

exports.addRoleValidator = [
  sanitizeBody,
  stringField('name', 'Role name'),
  stringField('description', 'Description'),
];

exports.updateRoleValidator = [
  sanitizeBody,
  param('id')
    .notEmpty().withMessage('Id is required')
    .isInt().withMessage('Id should be a number'),

  stringField('name', 'Role name', true),
  stringField('description', 'Description', true),
];
