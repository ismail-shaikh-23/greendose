/* eslint-disable max-len */ 
const db = require('../models'); 
const { 
  NoDataFoundError, 
  BadRequestError,
  InternalServerError, 
} = require('../../utils/customError'); 
const handleSuccess = require('../../utils/successHandler'); 
const { getPagination } = require('../../utils/pagination');
const commonFunctions = require('../../utils/commonFunctions');
const { Op } = require('sequelize');

exports.createProductImage = async(productImageData) => {   
  const productImageCreated = await commonFunctions.create('productImage', productImageData);
  if (!productImageCreated) { 
    throw new InternalServerError('Internal server error');
  }
  return handleSuccess('Product-Image created');  
}; 

exports.fetchProductImageDetails = async({ pageNo, pageSize }) => { 
  const { offset, limit } = getPagination({ pageNo, pageSize });
  const productImageFound = await db.productImage.findAll({ 
    condition: { deletedAt: null },  
    offset: offset,
    limit: limit,
    distinct: true,
    // raw: true
  }); 
  if (productImageFound && productImageFound.length) { 
    return handleSuccess('Product-Image found', productImageFound); 
  }
  throw new NoDataFoundError('No Product-Image found'); 
}; 

exports.fetchProductImageById = async(productImageData) => { 
  const { id } = productImageData; 
  const productImageFound = await db.productImage.findOne({ 
    where: { id: id, deletedAt: null }, 
  }); 
  if (productImageFound) { 
    return handleSuccess('Product-Image found', productImageFound); 
  } 
  throw new NoDataFoundError(`No Product-Image found with Id ${id}`); 
  
}; 

exports.updateProductImageById = async( 
  id, 
  { productId, fileIds }, 
) => { 
  try {
  const existingImages = await commonFunctions.findAll('productImage', {
    condition: {
      productId,
      fileId: { [Op.in]: fileIds }
    }
  });

  const existingFileIds = existingImages.map(img => img.fileId);

  const toCreate = [];
  const toDelete = [];

  for (const fileId of fileIds) {
    if (existingFileIds.includes(fileId)) {
      toDelete.push(fileId);
    } else {
      toCreate.push({ productId, fileId });
    }
  }

  if (toDelete.length > 0) {
    await commonFunctions.destroy('productImage', {
      productId,
      fileId: { [Op.in]: toDelete }
    });
  }
  if (toCreate.length > 0) {
    await commonFunctions.create('productImage', toCreate, true);
  }

  return handleSuccess('Product-Image updated');
} catch (error) {
  throw new InternalServerError('Internal server error');
}



}; 

exports.deleteProductImageById = async(id) => { 
  const removedProductImage = await db.productImage.destroy({ where: { id: id } }); 
  if (removedProductImage) { 
    return handleSuccess('Product-Image deleted'); 
  }
  throw new NoDataFoundError(`No Product-Image found with Id ${id}`); 
}; 
