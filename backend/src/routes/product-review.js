const router = require('express').Router(); 
const { errorWrapper } = require('../../utils/errorWrapper'); 

const { 
    insertProductReview, 
    retrieveProductReviewById, 
    modifyProductReview, 
    removeProductReview,
    fetchReviewByProductId
} = require('../controllers/productReview'); 
const checkAuth = require('../middleWare/checkAuth'); 
const checkPermission = require('../middleWare/checkPermission'); 
const { validateAddReview, validateUpdateReview } = require('../validators/productReview');
const { validationHandler } = require('../validators/validationHandler');

router.post('/', checkAuth, checkPermission, validateAddReview, validationHandler, errorWrapper(insertProductReview)); 
router.get('/:id', checkAuth, errorWrapper(retrieveProductReviewById));
router.put('/:id', checkAuth, checkPermission, validateUpdateReview, validationHandler, errorWrapper(modifyProductReview)); 
router.delete('/:id', checkAuth, checkPermission, errorWrapper(removeProductReview));
router.get('/product/:id', checkAuth, errorWrapper(fetchReviewByProductId));

module.exports = router; 