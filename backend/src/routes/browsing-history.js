/* eslint-disable max-len */
const router = require('express').Router();
const { errorWrapper } = require('../../utils/errorWrapper');
const { insertBrowsingHistory, fetchBrowsingHistory, removeBrowsingHistory } = require('../controllers/browsingHistory');

const checkAuth = require('../middleWare/checkAuth'); 

 
router.post('/:productId', checkAuth, errorWrapper(insertBrowsingHistory));
router.get('/', checkAuth, errorWrapper(fetchBrowsingHistory));
router.delete('/:id', checkAuth, errorWrapper(removeBrowsingHistory));


module.exports = router;