/* eslint-disable max-len */
const response = require('../../utils/response');
const { createOfferProduct, fetchOfferProductList, fetchOfferProductById, deleteOfferProductById, updateOfferProductById, getCartDiscount, updatePriority } = require('../services/offerProduct');

exports.createOfferProduct = async(req, res) => {
  const result = await createOfferProduct(req.body);
  return response.ok(res, result);
};

exports.getOfferProducts = async(req, res) => {
  const result = await fetchOfferProductList(req.query);
  return response.ok(res, result);
};

exports.getOfferProductById = async(req, res ) => {
  const { id } = req.params;
  const result = await fetchOfferProductById(id);
  return response.ok(res, result);
};

exports.deleteOfferProduct = async(req, res ) => {
  const { id } = req.params;
  const result = await deleteOfferProductById(id);
  return response.ok(res, result);
};

exports.updateOfferProduct = async(req, res ) => {
  const result = await updateOfferProductById(req.body);
  return response.ok(res, result);
};

exports.getCartDiscount = async(req, res ) => {
  const result = await getCartDiscount(req.body);
  return response.ok(res, result);
};

exports.updatePriority = async(req, res) => {
  const result = await updatePriority(req.body);
  return response.ok(res, result);
};