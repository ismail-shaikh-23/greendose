const response = require('../../utils/response');
const cartService = require('../services/cart');

exports.insertCart = async (req, res) => {
  const customerId = req.userData.id;
  const result = await cartService.createCart(customerId, req.body);
  return response.created(res, result);
};

exports.retrieveCartByCustomerId = async (req, res) => {
  const customerId = req.userData.id;
  const result = await cartService.fetchCartByCustomerId(customerId);
  return response.ok(res, result);
};

exports.manageCartProducts = async (req, res) => {
  const { items } = req.body;
  const customerId = req.userData.id;
  const result = await cartService.manageProductsOfCart(customerId, items);
  return response.ok(res, result);
};

exports.clearCart = async (req, res) => {
  const customerId = req.userData.id;
  const result = await cartService.clearCart(customerId);
  return response.ok(res, result);
};

exports.getCartItemCount = async (req, res) => {
  const customerId = req.userData.id;
  const result = await cartService.getCartItemCount(customerId);
  return response.ok(res, result);
};

exports.updateCartItemQuantity = async (req, res) => {
  const customerId = req.userData.id;
  const result = await cartService.updateCartItemQuantity({...req.body, customerId});
  return response.ok(res, result);
};

exports.removeCartItem = async (req, res) => {
  const customerId = req.userData.id;
  const productId = req.body.productId;
  const result = await cartService.removeCartItem(customerId, productId);
  return response.ok(res, result);
};
