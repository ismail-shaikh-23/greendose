const { body } = require('express-validator');
const { sanitizeBodyHelper } = require('./validationHandler');

const allowedFieldsAddAndUpdateFaq = ['question','answer'];
exports.validateAddFaq = [
  sanitizeBodyHelper(allowedFieldsAddAndUpdateFaq),

  body('question')
    .notEmpty()
    .withMessage('question is required')
    .isString()
    .withMessage('question must be string'),

  body('answer')
    .notEmpty()
    .withMessage('answer is required')
    .isString()
    .withMessage('answer must be string'),
 
];

exports.validateUpdateFaq = [
  sanitizeBodyHelper(allowedFieldsAddAndUpdateFaq),

  body('question')
    .optional()
    .isString()
    .withMessage('question must be string'),

  body('answer')
    .optional()
    .isString()
    .withMessage('answer must be string'),
];
