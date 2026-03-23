const router = require('express').Router();
const { errorWrapper } = require('../../utils/errorWrapper');
const checkAuth = require('../middleWare/checkAuth');
const cartController = require('../controllers/cart');
const { validateAddProduct, validateUpdateProductQuantity, validateDeleteCart } = require('../validators/cart');
const { validationHandler } = require('../validators/validationHandler');

router.post('/', checkAuth, errorWrapper(cartController.insertCart)); // this will be neverv get used because cart is getting added while adding customer
router.get('/', checkAuth, errorWrapper(cartController.retrieveCartByCustomerId));
router.post('/products', checkAuth, validateAddProduct, validationHandler, errorWrapper(cartController.manageCartProducts));
router.delete('/clear', checkAuth, errorWrapper(cartController.clearCart));
router.get('/count', checkAuth, errorWrapper(cartController.getCartItemCount));
router.put('/item', checkAuth, validateUpdateProductQuantity, validationHandler, errorWrapper(cartController.updateCartItemQuantity));
router.delete('/item', checkAuth, validateDeleteCart, validationHandler, errorWrapper(cartController.removeCartItem));

module.exports = router;
