const { validationResult } = require('express-validator');
const _ = require('lodash');
const { ValidationError } = require('../../utils/customError');

exports.validationHandler = async(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};


exports.sanitizeBodyHelper = (allowedFields) => {
  return (req, res, next) => {
    req.body = _.pick(req.body, allowedFields);
    if(Object.keys(req.body).length === 0){
      throw new ValidationError('Missing valid fields.');
    }
    next();
  };
};