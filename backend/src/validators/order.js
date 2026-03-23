const { body, param } = require('express-validator');
const { sanitizeBodyHelper } = require('./validationHandler');

const allowedFieldsUpdateStatus = ['status', 'remarks'];
const allowedFieldsUpdatePaymentStatus = ['paymentStatus', 'remarks'];
const allowedFieldsUpdateDeliveryStatus = ['status'];


exports.validateUpdateStatus = [
  sanitizeBodyHelper(allowedFieldsUpdateStatus),

  param('id')
    .notEmpty()
    .withMessage('Order id is required')
    .isInt()
    .withMessage('Order id should be numeric'),

  body('status')
    .isIn(['pending', 'success', 'failed'])
    .withMessage('Please provide a valid status type'),

  body('remarks')
    .optional()
    .isString()
    .withMessage('Commission fee should be string'),

];

exports.validateUpdatePaymentStatus = [
  sanitizeBodyHelper(allowedFieldsUpdatePaymentStatus),

  param('id')
    .notEmpty()
    .withMessage('Order id is required')
    .isInt()
    .withMessage('Order id should be numeric'),

  body('paymentStatus')
    .isIn(['paid', 'failed', 'refunded'])
    .withMessage('Please provide a valid status type'),

];

exports.validateUpdateDeliveryStatus = [
  sanitizeBodyHelper(allowedFieldsUpdateDeliveryStatus),

  param('id')
    .notEmpty()
    .withMessage('Order id is required')
    .isInt()
    .withMessage('Order id should be numeric'),

  body('status')
    .isIn(['shipped', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled'])
    .withMessage('Please provide a valid status type'),

];

exports.validateDeleteOrder = [

  param('id')
    .notEmpty()
    .withMessage('Order id is required')
    .isInt()
    .withMessage('Order id should be numeric'),

  body('remarks')
    .optional()
    .isString()
    .withMessage('Commission fee should be string'),

];
