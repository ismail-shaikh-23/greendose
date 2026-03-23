/* eslint-disable max-len */
const router = require('express').Router();
const { errorWrapper } = require('../../utils/errorWrapper');
const {
  insertCustomer,
  retrieveCustomer,
  retrieveCustomerById,
  modifyCustomer,
  removeCustomer,
  customerCampaign,
} = require('../controllers/customer');

const checkAuth = require('../middleWare/checkAuth'); 
const { validateAddCustomer, validateUpdateCustomer } = require('../validators/customer');
const { validationHandler } = require('../validators/validationHandler');
 
router.post('/', validateAddCustomer, validationHandler, errorWrapper(insertCustomer));
router.get('/', checkAuth, errorWrapper(retrieveCustomer));
router.get('/campaign', checkAuth, errorWrapper(customerCampaign));
router.get('/:id', checkAuth, errorWrapper(retrieveCustomerById));
router.put('/:id', validateUpdateCustomer, validationHandler, checkAuth, errorWrapper(modifyCustomer));
router.delete('/:id', checkAuth, errorWrapper(removeCustomer));

module.exports = router;
