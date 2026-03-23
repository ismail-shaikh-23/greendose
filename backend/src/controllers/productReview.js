const {
  createProductReview,
  fetchProductReviewById,
  updateProductReviewById,
  deleteProductReviewById,
  retriveProductReviewByProductId
} = require('../services/productReview'); 
const response = require('../../utils/response'); 

exports.insertProductReview = async(req, res) => { 
  const customerId = req.userData.id; 
  const body = req.body;
  const result = await createProductReview({...body, customerId}); 
  return response.created(res, result); 
}; 

exports.retrieveProductReviewById = async(req, res) => { 
  const { id } = req.params; 
  const result = await fetchProductReviewById(id); 
  return response.ok(res, result); 
}; 

exports.modifyProductReview = async(req, res) => { 
  const { id } = req.params; 
  const customerId = req.userData.id;
  const updateData = req.body; 
  const result = await updateProductReviewById(id, customerId, updateData); 
  return response.ok(res, result); 
}; 

exports.removeProductReview = async(req, res) => { 
  const { id } = req.params; 
  const customerId = req.userData.id;
  const result = await deleteProductReviewById(id, customerId); 
  return response.ok(res, result); 
}; 

exports.removeProductReview = async(req, res) => { 
  const { id } = req.params; 
  const customerId = req.userData.id;
  const result = await deleteProductReviewById(id, customerId); 
  return response.ok(res, result); 
}; 

exports.fetchReviewByProductId = async(req, res) => { 
  const { id } = req.params; 
  const query = req.query;
  const result = await retriveProductReviewByProductId(id, query); 
  return response.ok(res, result); 
}; 

