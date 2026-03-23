 
const { body, query } = require('express-validator');
const { sanitizeBodyHelper } = require('./validationHandler');
const { ValidationError } = require('../../utils/customError');

const allowedFields = ['identifier', 'password', 'otp'];
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const sanitizeBody = sanitizeBodyHelper(allowedFields);


exports.loginAuthValidator = [
  sanitizeBody,

  query('isCustomer')
    .optional()
    .isString()
    .withMessage("Is Customer field should be string")
    .custom((value, { req }) => {
      if(req.body.password){
        throw new ValidationError('Password not required for login of customer');
      }
      if(!req.body.otp){
        throw new ValidationError('Otp is required for login of customer');
      }
      return true;
    }),

  body('identifier')
    .notEmpty()
    .withMessage('email or mobile number is required')
    .isString()
    .withMessage('email or mobile number must be a string'),

  body('otp')
    .optional()
    .isString()
    .withMessage('otp must be a string'),

  body('password')
    .optional()
    .isString()
    .withMessage('password must be a string')
];

