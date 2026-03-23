const router = require('express').Router();
const { errorWrapper } = require('../../utils/errorWrapper');
const checkAuth = require('../middleWare/checkAuth');
const checkPermission = require('../middleWare/checkPermission');
const orderController = require('../controllers/order');
const { validationHandler } = require('../validators/validationHandler');
const checkVendor = require('../middleWare/checkVendor');
const { 
    validateUpdateStatus, 
    validateUpdatePaymentStatus, 
    validateUpdateDeliveryStatus,
    validateDeleteOrder
} = require('../validators/order');


// web api's
router.get('/', checkAuth, checkVendor, errorWrapper(orderController.listOrders));
router.get('/delivery-status/:id', checkAuth, checkPermission, errorWrapper(orderController.getDeliveryStatus));
router.put('/status/:id', checkAuth, checkPermission, validateUpdateStatus, validationHandler, errorWrapper(orderController.updateOrderStatus));
router.put('/payment-status/:id', checkAuth, checkPermission, validateUpdatePaymentStatus, validationHandler, errorWrapper(orderController.updatePaymentStatus));
router.put('/delivery-status/:id', checkAuth, checkVendor, validateUpdateDeliveryStatus, validationHandler, errorWrapper(orderController.updateDeliveryStatus))
router.get('/details/:id', checkAuth, checkVendor, errorWrapper(orderController.getOrderById));

// mobile api's
router.post('/', checkAuth, checkPermission, errorWrapper(orderController.insertOrder));
router.delete('/cancel/:id', checkAuth, checkPermission, validateDeleteOrder, validationHandler, errorWrapper(orderController.cancelOrder));
router.get('/tracking', checkAuth, checkPermission, errorWrapper(orderController.getOrderTrackingHistory));
router.get('/mobile/:id/:orderDetailId', checkAuth, checkPermission, errorWrapper(orderController.getOrderDetailForMobile));


module.exports = router;
