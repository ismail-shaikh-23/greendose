/* eslint-disable max-len */
const { 
    createWishList,
    fetchWishListDetails,
    fetchWishListById,
    updateWishListById,
    deleteWishListById
} = require('../services/wishList'); 
const response = require('../../utils/response'); 

exports.insertWishList = async(req, res) => {
  const customerId = req.userData.id;
  const result = await createWishList({ customerId, ...req.body }); 
  return response.created(res, result); 
}; 

exports.retrieveWishList = async(req, res) => { 
  const customerId = req.userData.id;
  const result = await fetchWishListDetails(customerId, req.query); 
  return response.ok(res, result); 
}; 

exports.retrieveWishListById = async(req, res) => { 
  const { id } = req.params;
  const customerId = req.userData.id;
  const result = await fetchWishListById(id, customerId); 
  return response.ok(res, result); 
}; 

exports.modifyWishList = async(req, res) => { 
  const { id } = req.params; 
  const customerId = req.userData.id;
  const result = await updateWishListById(id, customerId, req.body ); 
  return response.ok(res, result); 
}; 

exports.removeWishList = async(req, res) => { 
  const { id } = req.params; 
  const customerId = req.userData.id;
  const result = await deleteWishListById(id, customerId); 
  return response.ok(res, result); 
}; 

