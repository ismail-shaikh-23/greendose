/* eslint-disable max-len */
const router = require('express').Router(); 
const { errorWrapper } = require('../../utils/errorWrapper'); 

const { relevance, globalSearch, randomProducts } = require('../controllers/search'); 
const checkAuth = require('../middleWare/checkAuth');

router.get('/relevance',checkAuth, errorWrapper(relevance));
router.get('/',checkAuth, errorWrapper(globalSearch));
router.get('/products', checkAuth, errorWrapper(randomProducts));

module.exports = router; 