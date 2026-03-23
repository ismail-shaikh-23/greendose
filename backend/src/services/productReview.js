/* eslint-disable max-len */ 
const db = require('../models'); 
const { 
  NoDataFoundError, 
  InternalServerError, 
  ValidationError
} = require('../../utils/customError'); 
const handleSuccess = require('../../utils/successHandler'); 
const commonFunctions = require('../../utils/commonFunctions');

exports.createProductReview = async(productReviewData) => {   
  const { productId } = productReviewData;

  const productExist = await commonFunctions.findByPk('product', productId);
  if(!productExist){
    throw new ValidationError(`Product with id ${productId} not found`);
  }
  const productReview = await commonFunctions.create('productReview', productReviewData);
  if (!productReview) { 
    throw new InternalServerError('Internal server error');
  }
  return handleSuccess('Product review added successfully');  
}; 

exports.fetchProductReviewById = async(id) => { 
  const options = {};
  options.attributes = {
    exclude: ["createdAt", "updatedAt", "deletedAt"]
  }
  const productImageFound = await commonFunctions.findByPk('productReview', id, options); 
  if (!productImageFound) { 
    throw new NoDataFoundError(`No Product-Image found with Id ${id}`); 
  }  
  return handleSuccess('Product-Image found', productImageFound); 
}; 

exports.updateProductReviewById = async(id, customerId, updateData) => { 
  const options = {};
  options.condition = {
    id, 
    customerId
  }
  const reviewExist = await commonFunctions.findOne('productReview', options);
  if(!reviewExist){
    throw new NoDataFoundError(`No product review found with Id ${id} by customer id ${customerId}`);
  }

  if(updateData.rating){
    reviewExist.rating = updateData.rating;
  }
    if(updateData.feedback){
    reviewExist.feedback = updateData.feedback;
  }

  const updateReview = await reviewExist.save();
  if(!updateReview){
    throw new InternalServerError('Internal server error');
  }

  return handleSuccess('Review updated successfully');  
}; 

exports.deleteProductReviewById = async(id, customerId) => { 
  const options = {};
  options.condition = {
    id, 
    customerId
  }
  const reviewExist = await commonFunctions.findOne('productReview', options);
  if(!reviewExist){
    throw new NoDataFoundError(`No product review found with Id ${id} by customer id ${customerId}`);
  }

  const updateReview = await commonFunctions.destroy("productReview", options.condition);
  if(!updateReview){
    throw new InternalServerError('Internal server error');
  }

  return handleSuccess('Review deleted successfully'); 
}; 

exports.retriveProductReviewByProductId = async(productId, query) => { 
  let page = Number(query.page) || 1;
  let limit = Number(query.limit) || 10;
  const offset = (page - 1) * limit;

  const options = {};
  options.condition = {
    productId
  }

  options.attributes = {
      exclude: ["createdAt", "updatedAt", "deletedAt"]
  }
  options.include = [
    {
      model: db.customer,
      as: 'customer',
      attributes: ["firstName", "lastName", "userName"]
    }
  ]
  options.limit = limit;
  options.offset = offset;

  const reviewRecords = await commonFunctions.findAll('productReview', options);
  if (!reviewRecords.rows || reviewRecords.rows.length === 0) {
      throw new NoDataFoundError('No product reviews found');
  }

  return handleSuccess('Review fetched successfully', reviewRecords); 
}; 
