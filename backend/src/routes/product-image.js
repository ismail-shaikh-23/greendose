const router = require('express').Router(); 
const { errorWrapper } = require('../../utils/errorWrapper'); 

const { 
  insertProductImage, 
  retrieveProductImage, 
  retrieveProductImageById, 
  modifyProductImage, 
  removeProductImage, 
} = require('../controllers/productImage'); 
const checkAuth = require('../middleWare/checkAuth'); 
const permission = require('../middleWare/checkPermission'); 

router.post('/', checkAuth, permission, errorWrapper(insertProductImage)); 
router.get('/', checkAuth, permission, errorWrapper(retrieveProductImage)); 
router.get('/:id', checkAuth, permission,
  errorWrapper(retrieveProductImageById));
router.put('/:id', checkAuth, permission,
  errorWrapper(modifyProductImage)); 
router.delete('/:id', checkAuth, permission,
  errorWrapper(removeProductImage));

module.exports = router; 
