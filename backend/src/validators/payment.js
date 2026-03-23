const { body } = require('express-validator');
const { sanitizeBodyHelper } = require('./validationHandler');

const allowedFieldsAddProduct = ['orderId', 'amount'];

exports.validatePaymentDetails = [
  sanitizeBodyHelper(allowedFieldsAddProduct),

  body('orderId')
    .notEmpty()
    .withMessage('Order id is required')
    .isInt()
    .withMessage('Order id should be numeric'),

  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isInt()
    .withMessage('Amount should be numeric'),

];