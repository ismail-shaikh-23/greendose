/* eslint-disable max-len */
const { body, param } = require('express-validator');
const { sanitizeBodyHelper } = require('./validationHandler');

const allowedFields = ['actionName', 'description', 'method', 'baseUrl', 'path'];

const sanitizeBody = sanitizeBodyHelper(allowedFields);

const stringField = (field, label, isOptional = false) => {
  const validator = body(field)
    .isString().withMessage(`${label} must be a string`)
    .trim();

  return isOptional
    ? validator.optional()
    : validator.notEmpty().withMessage(`${label} is required`);
};

exports.addPermissionValidator = [
  sanitizeBody,
  stringField('actionName', 'Action name'),
  stringField('description', 'Description'),
  stringField('method', 'Method'),
  stringField('baseUrl', 'Base URL'),
  stringField('path', 'Path'),
];

exports.updatePemissionValidator = [
  sanitizeBody,
  param('id')
    .notEmpty().withMessage('Id is required')
    .isInt().withMessage('Id should be a number'),

  stringField('actionName', 'Action name', true),
  stringField('description', 'Description', true),
  stringField('method', 'Method', true),
  stringField('baseUrl', 'Base URL', true),
  stringField('path', 'Path', true),
];
