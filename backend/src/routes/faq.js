/* eslint-disable max-len */
const router = require('express').Router(); 
const { errorWrapper } = require('../../utils/errorWrapper'); 
const { insertFaq, fetchAllFaq, fetchFaqById, modifyFaq, removeFaqById } = require('../controllers/faq');
const { validateAddFaq, validateUpdateFaq } = require('../validators/faq');
const { validationHandler } = require('../validators/validationHandler');
 
router.post('/', validateAddFaq, validationHandler, errorWrapper(insertFaq)); 
router.get('/', errorWrapper(fetchAllFaq)); 
router.put('/:id',validateUpdateFaq, validationHandler, errorWrapper(modifyFaq)); 
router.get('/:id', errorWrapper(fetchFaqById));
router.delete('/:id', errorWrapper(removeFaqById));

module.exports = router; 
