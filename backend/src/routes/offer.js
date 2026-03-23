const express = require('express'); 

const router = express.Router(); 
const { 
  getOffers, getOfferById, createOffer, 
  updateOffer, deleteOffer,updateOfferStatus,
  fetchClearanceOffers,
} = require('../controllers/offer'); 
const { errorWrapper } = require('../../utils/errorWrapper'); 
const checkAuth = require('../middleWare/checkAuth'); 
const checkPermission = require('../middleWare/checkPermission'); 
const { createMultipleUpload } = require('../services/fileUpload');
const checkVendor = require('../middleWare/checkVendor');
const { validateUpdateOfferStatus,validateUpdateoffer,validateAddOffer } = require('../validators/offer');
const { validationHandler } = require('../validators/validationHandler');

router.get('/', checkAuth, checkPermission, checkVendor, errorWrapper(getOffers));
router.get('/dashboard', checkAuth, errorWrapper(fetchClearanceOffers));
router.get('/:id', checkAuth, errorWrapper(getOfferById));
router.post('/', checkAuth, createMultipleUpload, checkVendor, validateAddOffer, validationHandler, errorWrapper(createOffer));//
router.put('/:id', checkAuth, createMultipleUpload, checkVendor,validateUpdateoffer,validationHandler,errorWrapper(updateOffer));//
router.post('/update-status/:id', checkAuth, checkPermission, validateUpdateOfferStatus, validationHandler, errorWrapper(updateOfferStatus));
router.delete('/:id', checkAuth, errorWrapper(deleteOffer));

module.exports = router; 