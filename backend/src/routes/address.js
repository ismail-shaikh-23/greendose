/* eslint-disable max-len */ 
const express = require('express'); 

const router = express.Router(); 
const { errorWrapper } = require('../../utils/errorWrapper'); 
const checkAuth = require('../middleWare/checkAuth'); 
const { validationHandler } = require('../validators/validationHandler');
const { insertAddress, getAddresses, getAddressByCustomer, getAddressById, modifyAddress, removeAddress } = require('../controllers/address');
const { validateUpdateAddress, validateAddAddress } = require('../validators/address');
 
router.post('/', checkAuth, validateAddAddress, validationHandler, errorWrapper(insertAddress)); 
router.get('/', checkAuth, errorWrapper(getAddresses)); 
router.get('/customer', checkAuth, errorWrapper(getAddressByCustomer));
router.get('/:id', checkAuth, errorWrapper(getAddressById));
router.put('/:id', checkAuth, validateUpdateAddress, validationHandler, errorWrapper(modifyAddress)); 
router.delete('/:id', checkAuth, errorWrapper(removeAddress)); 

module.exports = router; 
