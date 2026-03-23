const { body, param } = require('express-validator');
const { sanitizeBodyHelper } = require('./validationHandler');

const allowedFields = ['roleId', 'permissionId'];

const sanitizeBody = sanitizeBodyHelper(allowedFields);

const intField = (field, label, isOptional = false) => {
  const validator = body(field)
    .isInt().withMessage(`${label} must be a number`);

  return isOptional
    ? validator.optional()
    : validator.notEmpty().withMessage(`${label} is required`);
};

exports.addRolePermissionValidator = [
  sanitizeBody,
  intField('roleId', 'Role ID'),
  intField('permissionId', 'Permission ID'),
];

exports.updateRolePermissionValidator = [
  sanitizeBody,
  param('id')
    .notEmpty().withMessage('Id is required')
    .isInt().withMessage('Id should be a number'),

  intField('roleId', 'Role ID', true),
  intField('permissionId', 'Permission ID', true),
];
