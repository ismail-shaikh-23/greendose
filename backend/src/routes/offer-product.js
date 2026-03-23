const express = require('express'); 

const router = express.Router(); 
const { 
  getOfferProducts, getOfferProductById, createOfferProduct, 
  updateOfferProduct, deleteOfferProduct, getCartDiscount, updatePriority,
} = require('../controllers/offerProduct.js'); 
const { errorWrapper } = require('../../utils/errorWrapper.js'); 
const checkAuth = require('../middleWare/checkAuth.js'); 
// const permission = require('../middleWare/checkPermission'); 

router.get('/', checkAuth, errorWrapper(getOfferProducts));
router.get('/:id', checkAuth, errorWrapper(getOfferProductById));
router.post('/', checkAuth, errorWrapper(createOfferProduct));
router.post('/cart-discount', errorWrapper(getCartDiscount));
router.post('/manipulate-offers', checkAuth, errorWrapper(updateOfferProduct));
router.delete('/:id', checkAuth, errorWrapper(deleteOfferProduct));

router.put('/', checkAuth, errorWrapper(updatePriority));

module.exports = router; 