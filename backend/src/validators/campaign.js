const { body, param } = require('express-validator');
const { sanitizeBodyHelper } = require('./validationHandler');
const { ValidationError } = require('../../utils/customError');

const allowedFields = ['name', 'startDate', 'endDate', 'type'];
const updateCampaignStatus = ['status'];
const validStatuses = ['approved', 'rejected'];

exports.validateAddcampaign = [
  sanitizeBodyHelper(allowedFields),

  body('name')
    .notEmpty()
    .withMessage('Campaign name is required')
    .isString()
    .withMessage('Campaign name should be string'),

  body('startDate')
    .notEmpty()
    .withMessage('Start date is required')
    .isString()
    .withMessage('Start date should be string'),

  body('endDate')
    .notEmpty()
    .withMessage('End date is required')
    .isString()
    .withMessage('End date should be string'),

  body('type')
    .notEmpty()
    .withMessage('End date is required')
    .isIn(['dashboard', 'profile', 'category'])
    .withMessage('Invalid campaign type value'),
];

exports.validateUpdatecampaign = [
  sanitizeBodyHelper(allowedFields),

  body('name')
    .optional()
    .isString()
    .withMessage('Campaign name should be string'),

  body('startDate')
    .optional()
    .isString()
    .withMessage('Start date should be string'),

  body('endDate')
    .optional()
    .isString()
    .withMessage('End date should be string'),
];

exports.validateUpdateCampaignStatus = [
  sanitizeBodyHelper(updateCampaignStatus),

  param('id')
    .notEmpty()
    .withMessage('Id is required')
    .isInt()
    .withMessage('Id should be a number'),

  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(validStatuses)
    .withMessage('Invalid status value'),

  body('rejectionReason').custom((value, { req }) => {
    console.log("Thissss")
    if (req.body.status === 'rejected') {
      console.log("This", value)
      if (!value || typeof value !== 'string' || value.trim() === '') {
        throw new ValidationError('Rejection reason is required when status is rejected');
      }
    } else if (req.body.status === 'approved' && value) {
      throw new ValidationError('Rejection reason is not required when status is approved');
    }
    return true;
  }),
];


