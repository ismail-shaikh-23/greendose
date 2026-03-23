/* eslint-disable max-len */ 
const express = require('express'); 

const router = express.Router(); 
const categoryController = require('../controllers/category'); 
const { errorWrapper } = require('../../utils/errorWrapper'); 
const checkAuth = require('../middleWare/checkAuth'); 
const checkPermission = require('../middleWare/checkPermission'); 
const { createMultipleUpload, createFileUpload } = require('../services/fileUpload');
const { createCategoryValidator, updateCategoryValidator } = require('../validators/category');
const { validationHandler } = require('../validators/validationHandler');
 
router.get('/', errorWrapper(categoryController.getCategories)); 
router.post('/', checkAuth, checkPermission, createMultipleUpload, createCategoryValidator, validationHandler, errorWrapper(categoryController.addCategory)); 
router.get('/mobile', errorWrapper(categoryController.fetchCategoriesForMobile));
router.get('/campaign', checkAuth, errorWrapper(categoryController.categoryCampaign));
router.put('/:id',checkAuth, checkPermission, createFileUpload, updateCategoryValidator, validationHandler, errorWrapper(categoryController.updateCategory)); 
router.delete('/:id',checkAuth, checkPermission, errorWrapper(categoryController.deleteCategory)); 
router.get('/:id', errorWrapper(categoryController.getCategory)); 

module.exports = router; 
