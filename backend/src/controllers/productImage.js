const {
  createProductImage,
  fetchProductImageDetails,
  fetchProductImageById,
  updateProductImageById,
  deleteProductImageById,
} = require('../services/produtImage'); 
const response = require('../../utils/response'); 

exports.insertProductImage = async(req, res) => { 
  const { productId, fileId } = req.body; 
  const result = await createProductImage({ 
    productId, fileId, 
  }); 
  return response.created(res, result); 
}; 

exports.retrieveProductImage = async(req, res) => { 
  const { pageSize, pageNumber } = req.query;
  const result = await fetchProductImageDetails({ pageSize, pageNumber }); 
  return response.ok(res, result); 
}; 

exports.retrieveProductImageById = async(req, res) => { 
  const { id } = req.params; 
  const result = await fetchProductImageById({ id }); 
  return response.ok(res, result); 
}; 

exports.modifyProductImage = async(req, res) => { 
  const { id } = req.params; 
  const { productId, fileId } = req.body; 
  const result = await updateProductImageById(id, { 
    productId, fileId, 
  }); 
  return response.ok(res, result); 
}; 

exports.removeProductImage = async(req, res) => { 
  const { id } = req.params; 
  const result = await deleteProductImageById(id); 
  return response.ok(res, result); 
}; 
