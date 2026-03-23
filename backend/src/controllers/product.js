/* eslint-disable max-len */ 
const { createProduct, fetchProductList, fetchProduct, alterProduct, discardProduct, discardProductImages, fetchCategoryProductsService, fetchProductForMobile } = require('../services/product'); 
const response = require('../../utils/response'); 
const moment = require('moment'); 

exports.addProduct = async(req, res) => {
  const fileIds = req.uploadedFiles || [];
  let body = req.body;
  body.userId = req.userData.id;
  body.fileIds = fileIds;

  const result = await createProduct(body);
  return response.ok(res, result);
};

exports.getProducts = async(req, res) => { 
  const result = await fetchProductList(req.query, req.vendor); 
  return response.ok(res, result);
}; 

exports.getProduct = async(req, res) => { 
  const result = await fetchProduct(req.params.id, req.vendor); 
  return response.ok(res, result); 
}; 

exports.updateProduct = async(req, res) => {
  const { id } = req.params;
  const creator = req.userData.id;
  const fileIds = req.uploadedFiles;
  let body = req.body;

  if (body.expiryDate) {
    const momentExpiryDate = moment.utc(body.expiryDate, 'YYYY-MM-DD').toDate();
    body.momentExpiryDate = momentExpiryDate;
    delete body.expiryDate;
  }

  body.creator = creator;
  body.fileIds = fileIds;
  body.id = id;

  const result = await alterProduct(body, req.vendor);
  return response.ok(res, result);
};

exports.deleteProduct = async(req, res) => { 
  const { id } = req.params; 
  const result = await discardProduct(id); 
  return response.ok(res, result); 
}; 

exports.deleteProductImages = async(req, res) => { 
  const { fileIds, productId } = req.body; 
  const result = await discardProductImages({ fileIds, productId }); 
  return response.ok(res, result); 
};

exports.fetchCategoryProducts = async(req, res)=> {
  const categoryId = req.params.id;
  const result = await fetchCategoryProductsService(categoryId);
  return response.ok(res, result);
};

exports.fetchProductForMobile = async(req, res) => {
  const productId = req.params.id;
  const result = await fetchProductForMobile(productId);
  return response.ok(res, result);
}