const router = require('express').Router(); 
const { errorWrapper } = require('../../utils/errorWrapper'); 
const checkAuth = require('../middleWare/checkAuth'); 
const checkPermission = require('../middleWare/checkPermission');
const dashBoardController = require('../controllers/dashboardAdmin'); 

router.get('/count', checkAuth, checkPermission, errorWrapper(dashBoardController.counts));
router.get('/top-products', checkAuth, checkPermission, errorWrapper(dashBoardController.topProducts));
router.get('/expiry-alert', checkAuth, checkPermission, errorWrapper(dashBoardController.expiryAlertProducts));
router.get('/sales', checkAuth, checkPermission, errorWrapper(dashBoardController.salesGraph));

module.exports = router; 