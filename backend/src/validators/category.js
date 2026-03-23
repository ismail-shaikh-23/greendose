/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
const { body } = require('express-validator');
const { sanitizeBodyHelper } = require('./validationHandler');

const allowedFields = ['name'];

const nameValidator = (isOptional = false) => {
  const validator = body('name')
    .isString().withMessage('name must be a string')
    .trim();

  return isOptional ? validator.optional() : validator.notEmpty().withMessage('name is required');
};

exports.createCategoryValidator = [
  sanitizeBodyHelper(allowedFields),
  nameValidator(false),
];

exports.updateCategoryValidator = [
  sanitizeBodyHelper(allowedFields),
  nameValidator(true),
];
