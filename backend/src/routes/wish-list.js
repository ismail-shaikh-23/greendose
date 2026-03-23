/* eslint-disable max-len */
const router = require('express').Router();
const { errorWrapper } = require('../../utils/errorWrapper');

const wishListController = require('../controllers/wishList');
const checkAuth = require('../middleWare/checkAuth'); 
const { validateAddAndUpdateWishList } = require('../validators/wishList');
const { validationHandler } = require('../validators/validationHandler');
 
router.post('/', checkAuth, validateAddAndUpdateWishList, validationHandler, errorWrapper(wishListController.insertWishList));
router.get('/my-list', checkAuth, errorWrapper(wishListController.retrieveWishList));
router.get('/:id', checkAuth, errorWrapper(wishListController.retrieveWishListById));
router.put('/:id', checkAuth, validateAddAndUpdateWishList, validationHandler, errorWrapper(wishListController.modifyWishList));
router.delete('/:id', checkAuth, errorWrapper(wishListController.removeWishList));


module.exports = router;