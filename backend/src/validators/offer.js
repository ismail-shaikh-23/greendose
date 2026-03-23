const { body, param } = require('express-validator');
const { sanitizeBodyHelper } = require('./validationHandler');
const { ValidationError } = require('../../utils/customError');

const validStatuses = ['approvalStatus', 'rejectReason'];

exports.validateUpdateOfferStatus = [
  sanitizeBodyHelper(validStatuses),
  param('id')
    .notEmpty().withMessage('Id is required')
    .isNumeric().withMessage('Id should be a number'),

  body('approvalStatus')
    .notEmpty()
    .withMessage('approval status is required')
    .isString()
    .withMessage('approval status should be string'),

  body('rejectReason')
    .custom((value, { req }) => {
      if (req.body.approvalStatus === 'rejected') {
        if (!value || typeof value !== 'string' || value.trim() === '') {
          throw new ValidationError('Rejection reason is required when status is rejected');
        }
      } else if (req.body.approvalStatus === 'approved' && value) {
        throw new ValidationError('Rejection reason is not required when status is approved');
      }
      return true;
    }),
];


const allowedFields = [
  'name',
  'type',
  'discountType',
  'discountValue',
  'startDate',
  'endDate'
];


exports.validateAddOffer = [
  sanitizeBodyHelper(allowedFields),
  body("name")
     .isString().withMessage('Name  is String')
     .notEmpty().withMessage("Name is not Empty"),
  
  body("type")   
      .notEmpty().withMessage("Type is Required")
      .isIn(['product', 'cart']).withMessage("Type must be product or cart"),

  body('discountType')
     .notEmpty().withMessage("Discount type must not empty")
     .isIn(['percentage', 'flat']).withMessage("Discount type must be percentage or flat"),

  body('discountValue')
    .notEmpty().withMessage("Discount value is required")
    .isInt().withMessage("Discount value must be an integer"),

  body('startDate')
    .notEmpty().withMessage("Start date must not Empty")
    .isString()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("Start date must be in ISO format (YYYY-MM-DD)"),

  body('endDate')
    .notEmpty().withMessage("End date must not Empty")
    .isString()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("End Date must be in ISO format (YYYY-MM-DD)"),
     
];

exports.validateUpdateoffer = [
  sanitizeBodyHelper(allowedFields),

  param("id").isInt().withMessage('Offer ID must be a valid integer'),

  body('name')
    .optional()
    .isString()
    .withMessage('Offer name should be string'),

  body('startDate')
    .optional()
    .isString()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("startDate must be in ISO format (YYYY-MM-DD)"),

  body('endDate')
    .optional()
    .isString()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("startDate must be in ISO format (YYYY-MM-DD)"),

  body("type") 
    .optional()  
    .isIn(['product', 'cart']).withMessage("type must be product or cart"),

  body('discountValue')
  .optional()
  .isDecimal().withMessage("Discount value must be a decimal number"),
 
];

