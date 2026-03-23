const { body, param } = require('express-validator');
const { sanitizeBodyHelper } = require('./validationHandler');

const allowedFields = ['productId', 'rating', 'feedback'];
const validRatings = [1, 2, 3, 4, 5];

exports.validateAddReview = [
  sanitizeBodyHelper(allowedFields),

  body('productId')
    .notEmpty()
    .withMessage('Product id is required')
    .isInt()
    .withMessage('Product id must be a number'),

  body('rating')
    .notEmpty()
    .withMessage('Rating is required')
    .isIn(validRatings)
    .withMessage('Allowed ratings values between 1 to 5'),

  body('feedback')
    .optional()
    .isString()
    .withMessage('End date should be string'),
];

exports.validateUpdateReview = [
  sanitizeBodyHelper(allowedFields),

  body('rating')
    .optional()
    .isIn(validRatings)
    .withMessage('Allowed ratings values between 1 to 5'),

  body('feedback')
    .optional()
    .isString()
    .withMessage('End date should be string'),
];