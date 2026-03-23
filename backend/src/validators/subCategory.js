const { body } = require('express-validator');
const { sanitizeBodyHelper } = require('./validationHandler');

const allowedFields = ['name', 'categoryId'];

const sanitizeBody = sanitizeBodyHelper(allowedFields);

const stringField = (field, label, isOptional = false) => {
  const validator = body(field)
    .isString().withMessage(`${label} must be a string`)
    .trim();

  return isOptional
    ? validator.optional()
    : validator.notEmpty().withMessage(`${label} is required`);
};

const intField = (field, label, isOptional = false) => {
  const validator = body(field)
    .isInt().withMessage(`${label} must be an integer`);

  return isOptional
    ? validator.optional()
    : validator.notEmpty().withMessage(`${label} is required`);
};

exports.createSubCategoryValidator = [
  sanitizeBody,
  stringField('name', 'Name'),
  intField('categoryId', 'Category ID'),
];

exports.updateSubCategoryValidator = [
  stringField('name', 'Name', true),
  intField('categoryId', 'Category ID', true),
];
