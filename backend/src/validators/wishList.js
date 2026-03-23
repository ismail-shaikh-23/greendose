const { body } = require('express-validator');
const { sanitizeBodyHelper } = require('./validationHandler');

const allowedFields = ['productId'];

exports.validateAddAndUpdateWishList = [
  sanitizeBodyHelper(allowedFields),

  body('productId')
    .notEmpty()
    .withMessage('Product id is required')
    .isInt()
    .withMessage('Product id should be numeric'),

];

