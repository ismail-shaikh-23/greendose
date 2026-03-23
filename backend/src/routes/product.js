/* eslint-disable max-len */ 
const express = require('express'); 

const router = express.Router(); 
const productController = require('../controllers/product'); 
const { errorWrapper } = require('../../utils/errorWrapper'); 
const checkAuth = require('../middleWare/checkAuth'); 
const checkPermission = require('../middleWare/checkPermission'); 
const { createMultipleUpload } = require('../services/fileUpload');
const { createProductValidator, updateProductValidator } = require('../validators/product');
const { validationHandler } = require('../validators/validationHandler');
const checkVendor = require('../middleWare/checkVendor');

router.get('/', checkAuth, checkVendor, errorWrapper(productController.getProducts)); 
router.post('/', checkAuth, checkPermission, createMultipleUpload, createProductValidator, validationHandler, errorWrapper(productController.addProduct)); 
router.put('/:id', checkAuth, checkPermission, createMultipleUpload, updateProductValidator, validationHandler, checkVendor, errorWrapper(productController.updateProduct)); 
router.delete('/:id', checkAuth, checkPermission, errorWrapper(productController.deleteProduct)); 
router.get('/:id', checkAuth, errorWrapper(productController.getProduct)); 
router.get('/mobile/:id',checkAuth, errorWrapper(productController.fetchProductForMobile))
router.post('/images', checkAuth, errorWrapper(productController.deleteProductImages)); 
router.get('/category/:id',checkAuth, errorWrapper(productController.fetchCategoryProducts));

module.exports = router; 
