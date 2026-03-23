const { body } = require('express-validator');
const { sanitizeBodyHelper } = require('./validationHandler');
const { ValidationError } = require('../../utils/customError');

const allowedFieldsAddProduct = ['items'];
const allowedFieldsUpdateQuantity = ['cartItemId', 'productId', 'newQuantity', 'newDiscount'];

exports.validateAddProduct = [
  sanitizeBodyHelper(allowedFieldsAddProduct),

  body('items')
    .notEmpty()
    .withMessage('Items are required')
    .isArray()
    .withMessage('Items should be array')
    .custom((items, { req }) => {
        for(let i=0;i<items.length;i++){
            if(!items[i]['productId'] || typeof items[i]['productId'] !== 'number'){
                throw new ValidationError('Please provide a valid product id');
            }
            if(!items[i]['quantity'] || typeof items[i]['quantity'] !== 'number'){
                throw new ValidationError('Please provide a quantity');
            }
            if(items[i]['discount'] && typeof items[i]['discount'] !== 'number'){
                throw new ValidationError('please provide a valid discount');
            }
        }
        return true;
    }),
];

exports.validateUpdateProductQuantity = [
  sanitizeBodyHelper(allowedFieldsUpdateQuantity),

  body('cartItemId')
    .notEmpty()
    .withMessage('Cart item id is required')
    .isInt()
    .withMessage('Cart item id should be numeric'),

  body('productId')
    .notEmpty()
    .withMessage('Product id is required')
    .isInt()
    .withMessage('Product id should be numeric'),

  body('newQuantity')
    .notEmpty()
    .withMessage('New quantity id is required')
    .isInt()
    .withMessage('New quantity id should be numeric'),

  body('newDiscount')
    .optional()
    .isInt()
    .withMessage('New discount should be numeric'),
];

exports.validateDeleteCart = [
  sanitizeBodyHelper(allowedFieldsUpdateQuantity),

  body('productId')
    .notEmpty()
    .withMessage('Product id is required')
    .isInt()
    .withMessage('Product id should be numeric'),
];