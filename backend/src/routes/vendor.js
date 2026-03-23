/* eslint-disable max-len */
const router = require('express').Router();
const { errorWrapper } = require('../../utils/errorWrapper');

const { 
    insertVendor, 
    retrieveVendor, 
    retrieveVendorById, 
    modifyVendor, 
    removeVendor, 
    updateStatus,
    registerVendor, 
    sendEmailToUnregisteredVendor} = require('../controllers/vendor');
const checkAuth = require('../middleWare/checkAuth'); 
const permission = require('../middleWare/checkPermission');
const { validateAddVendor, validateUpdateVendor, validateUpdateVendorStatus, validateRegisterVendor } = require('../validators/vendor');
const { validationHandler } = require('../validators/validationHandler');
 
router.post('/', checkAuth, permission, validateAddVendor, validationHandler, errorWrapper(insertVendor));
router.post('/register', validateRegisterVendor, validationHandler, errorWrapper(registerVendor));
router.get('/', checkAuth, permission, errorWrapper(retrieveVendor));
router.post('/send/email', checkAuth, permission, errorWrapper(sendEmailToUnregisteredVendor))
router.put('/status/:id', checkAuth, permission, validateUpdateVendorStatus, validationHandler, errorWrapper(updateStatus));
router.get('/:id', checkAuth, permission, errorWrapper(retrieveVendorById));
router.put('/:id', checkAuth, permission, validateUpdateVendor, validationHandler, errorWrapper(modifyVendor));
router.delete('/:id', checkAuth, permission, errorWrapper(removeVendor));

module.exports = router;
