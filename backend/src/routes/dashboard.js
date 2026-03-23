const router = require('express').Router(); 
const { errorWrapper } = require('../../utils/errorWrapper'); 
const { dashBoard,
  fixedCategories, 
  popularCategories,
  fetchBestDeals,
  fetchCommonDeals,
  fetchCampaigns,
} = require('../controllers/dashboard'); 
const checkAuth = require('../middleWare/checkAuth'); 
 
router.get('/',checkAuth, errorWrapper(dashBoard));
router.get('/fixed-categories' ,checkAuth, errorWrapper(fixedCategories));
router.get('/popular-categories',checkAuth, errorWrapper(popularCategories));
router.get('/best-deals',checkAuth, errorWrapper(fetchBestDeals));
router.get('/common-deals',checkAuth, errorWrapper(fetchCommonDeals));
router.get('/campaign', checkAuth, errorWrapper(fetchCampaigns));

module.exports = router; 
