const router = require('express').Router();
const { errorWrapper } = require('../../utils/errorWrapper');
const checkAuth = require('../middleWare/checkAuth');
const orderPaymentController = require('../controllers/payment');
const { validatePaymentDetails } = require('../validators/payment');
const { validationHandler } = require('../validators/validationHandler');

router.post('/verify', errorWrapper(orderPaymentController.verifyPaymentAndUpdateStatus));
router.post('/initiate', checkAuth, validatePaymentDetails, validationHandler, errorWrapper(orderPaymentController.initiatePayment));
router.post('/callback', errorWrapper(orderPaymentController.handlePaymentCallback));

module.exports = router;
