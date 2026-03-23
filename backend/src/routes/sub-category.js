/* eslint-disable max-len */ 
const express = require('express'); 

const router = express.Router(); 
const categoryController = require('../controllers/subCategory'); 
const { errorWrapper } = require('../../utils/errorWrapper'); 
const checkAuth = require('../middleWare/checkAuth');  
const { createSubCategoryValidator, updateSubCategoryValidator } = require('../validators/subCategory');
const { validationHandler } = require('../validators/validationHandler');
const checkPermission = require('../middleWare/checkPermission'); 
const { createMultipleUpload, createFileUpload } = require('../services/fileUpload');
 
router.get('/', checkAuth, errorWrapper(categoryController.getSubCategories)); 
router.post('/', checkAuth, checkPermission, createMultipleUpload, createSubCategoryValidator, validationHandler, errorWrapper(categoryController.addSubCategory)); 
router.put('/:id', checkAuth, checkPermission, createFileUpload, updateSubCategoryValidator, validationHandler, errorWrapper(categoryController.updateSubCategory)); 
router.delete('/:id', checkAuth, checkPermission, errorWrapper(categoryController.deleteSubCategory)); 
router.get('/:id', checkAuth, errorWrapper(categoryController.getSubCategory)); 
router.get('/:id/product',checkAuth, errorWrapper(categoryController.fetchSubCategoryProducts));

module.exports = router; 
