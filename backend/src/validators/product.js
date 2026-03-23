const { body } = require('express-validator');
const { sanitizeBodyHelper } = require('./validationHandler');
const commonFunction = require('../../utils/commonFunctions');
const { BadRequestError } = require('../../utils/customError');

const allowedFields = [
  'name',
  'price',
  'expiryDate',
  'subCategoryId',
  'isPrescriptionRequired',
  'vendorId',
  'quantity',
  'brand',
  'tags',
  'description',
  'unit',
  'weight',
  'offerId'
];

const sanitizeBody = sanitizeBodyHelper(allowedFields);

const stringField = (field, label, isOptional = false) => {
  let validator = body(field)
    .isString().withMessage(`${label} must be a string`)
    .trim();

  return isOptional
    ? validator.optional()
    : validator.notEmpty().withMessage(`${label} is required`);
};

const intField = (field, label, isOptional = false) => {
  let validator = body(field)
    .isInt().withMessage(`${label} must be an integer`);

  return isOptional
    ? validator.optional()
    : validator.notEmpty().withMessage(`${label} is required`);
};

const boolField = (field, label, isOptional = false) => {
  let validator = body(field)
    .isBoolean().withMessage(`${label} must be a boolean`);

  return isOptional
    ? validator.optional()
    : validator.notEmpty().withMessage(`${label} is required`);
};

exports.createProductValidator = [
  sanitizeBody,
  stringField('name', 'Name'),
  stringField('description', 'Description'),
  body('unit')
    .notEmpty()
    .withMessage(`unit is required`)
    .custom(async (value, { req })=> {
      const unitType = await commonFunction.findOne('appSetting', { condition: { key: 'productUnitValue' }});
      if(!unitType){
        throw new BadRequestError("Please add unit type in app setting");
      }
      let isValidType = false;
      const units = JSON.parse(unitType.value);
      for(let i=0;i < units.length;i++){
        if(units[i] === value){
          isValidType = true;
          break;
        }
      }
      return isValidType;
    })
    .withMessage("Please provide a valid unit type"),
  intField('weight', 'Weight'),
  stringField('price', 'Price'),
  stringField('expiryDate', 'Expiry date'),
  intField('subCategoryId', 'Sub category ID'),
  boolField('isPrescriptionRequired', 'isPrescriptionRequired'),
  intField('vendorId', 'Vendor ID'),
  intField('offerId', 'Offer ID', true),
  stringField('quantity', 'Quantity'),
  stringField('brand', 'Brand'),
  body('tags')
    .optional()
    .isArray({ min: 1 }).withMessage('Tags must be an array')
    .bail()
    .custom((tags) => {
      if (!tags.every(tag => typeof tag === 'string')) {
        throw new Error('Each tag must be a string');
      }
      return true;
    }),
];

exports.updateProductValidator = [
  sanitizeBody,
  stringField('name', 'Name', true),
  stringField('description', 'Description', true),
  stringField('unit', 'Unit', true),
  stringField('weight', 'Weight', true),
  stringField('price', 'Price', true),
  stringField('expiryDate', 'Expiry date', true),
  intField('subCategoryId', 'Sub category ID', true),
  boolField('isPrescriptionRequired', 'isPrescriptionRequired', true),
  intField('vendorId', 'Vendor ID', true),
  intField('offerId', 'Offer ID', true),
  stringField('quantity', 'Quantity', true),
  stringField('brand', 'Brand', true),
  body('tags')
    .optional()
    .isArray({ min: 1 }).withMessage('Tags must be an array')
    .custom((tags) => {
      if (!tags.every(tag => typeof tag === 'string')) {
        throw new Error('Each tag must be a string');
      }
      return true;
    }),
];
