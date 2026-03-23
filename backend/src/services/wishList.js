/* eslint-disable max-len */
const db = require('../models'); 
const { sequelize } = db;
const { NoDataFoundError, BadRequestError, ValidationError, InternalServerError } = require('../../utils/customError'); 
const handleSuccess = require('../../utils/successHandler'); 
const commonFunctions = require('../../utils/commonFunctions');
const { Op } = require('sequelize');

exports.createWishList = async(wishListData) => {
    const { customerId, productId } = wishListData;
    const customerExist = await commonFunctions.findByPk('customer', customerId);
    if(!customerExist){
        throw new BadRequestError(`Customer not found with id ${customerId}`);
    }

    const productExist = await commonFunctions.findByPk('product', productId);
    if(!productExist){
        throw new BadRequestError(`Product not found with id ${productId}`);
    }
    const verifyIfExistWishlistProduct = await commonFunctions.findOne('wishList', { condition : { productId,customerId } });
    if(verifyIfExistWishlistProduct){
        await commonFunctions.destroy('wishList', { id: verifyIfExistWishlistProduct.id });
        return handleSuccess('Product removed from the wishList');
    }
    const createWishList = await commonFunctions.create('wishList', wishListData);
    if(!createWishList){
      throw new InternalServerError('Internal server error'); 
    }

    return handleSuccess('WishList created');
};

exports.fetchWishListDetails = async(customerId, query) => { 
  let page = Number(query.page) || 1;
  let limit = Number(query.limit) || 10;
  const offset = (page - 1) * limit;
  const options = {};

  options.condition = {
    customerId
  };
  options.offset = offset;
  options.limit = limit;
  options.include = [
    {
      model: db.product,
      as: 'product',
      attrinutes: {
        exclude: ['createdAt', 'updatedAt', 'deletedAt'],
      },
      include: [
      {
        model: db.offerProduct,
        as: 'offerProducts',
         where: { status: 'active' },
          required: false,
        include:[
          {
            model: db.offer,
            as: 'offer',
             where: { status: 'active' },
          required: false,
          }
        ]
      },
        { 
        model: db.productImage, 
        as: 'images',
        attributes: {
          exclude: ["createdAt", "updatedAt", "deletedAt"],
          include: [ 
            [sequelize.literal(`"product->images->imageDetails"."path"`), 'imagePath']
          ],
        },
        include: {
          model: db.fileUpload,
          as: 'imageDetails',
          attributes: []
        }
      }],
    },
  ],

  options.subQuery = false;

  const wishListRecords = await commonFunctions.findAll('wishList', options);
  if (wishListRecords.rows.length === 0) { 
    throw new NoDataFoundError();
  } 
  const finalResult = {
    page,
    limit,
    totalResponses: wishListRecords.count,
    totalPages: Math.ceil(wishListRecords.count / limit),
    responses: wishListRecords.rows?.map((data) => {

      let offerValue = null;
      let offerType = null;
      let totalDiscount = 0;
      let image = null;

      if(data?.product?.offerProducts?.length > 0){
        let discountValue =  data?.product?.offerProducts[0]?.offer?.discountValue;
        let discountType = data?.product?.offerProducts[0]?.offer?.discountType;
        offerValue = data?.product?.offerProducts[0]?.offer?.discountValue;
        offerType = data?.product?.offerProducts[0]?.offer?.discountType;
        totalDiscount = discountType === 'percentage' ? ( data?.product?.price * discountValue ) / 100 || 1: discountValue || 0;
      }

      if(data?.product?.images?.length > 0){
        image = data?.product?.images[0].dataValues.imagePath;
      }

      return {
      id: data.id,
      customerId: data.customerId,
      productId: data.productId,
      createdAt: data.createdAt,
      product: {
        id: data?.product?.id || null,
        brand: data?.product?.brand || null,
        name: data?.product?.name || null,
        description: data?.product?.description || null,
        price: data?.product?.price || 0,
        expiryDate: data?.product?.expiryDate,
        quantity: data?.product?.quantity,
        unit: data?.product?.unit || "",
        weight: data?.product?.weight || "",
        createdAt: data?.product?.createdAt,
        image,
        offerValue,
        offerType,
        totalDiscount,
        subCategoryId: data?.product?.subCategoryId || null ,
        isPrescriptionRequired: data?.product?.isPrescriptionRequired || false,
      }
    }
    }),
  };
  return handleSuccess('WishList records fetched successfully', finalResult); 
}; 

exports.fetchWishListById = async(id, customerId) => { 
  if(!id){
    throw new ValidationError('Id is required');
  }

  const options = {};

  options.condition = {
    customerId
  };
  options.include = [
    {
      model: db.product,
      as: 'product',
      attrinutes: {
        exclude: ['createdAt', 'updatedAt', 'deletedAt'],
      },
      include: { 
        model: db.productImage, 
        as: 'images',
        attributes: {
          exclude: ["createdAt", "updatedAt", "deletedAt"],
          include: [ 
            [sequelize.literal(`"product->images->imageDetails"."path"`), 'imagePath']
          ],
        },
        include: {
          model: db.fileUpload,
          as: 'imageDetails',
          attributes: []
        }
      },
    },
  ],

  options.subQuery = false;

  const wishListDetails = await commonFunctions.findByPk('wishList', id, options); 
  if (!wishListDetails) { 
    throw new NoDataFoundError(`No wish list found with Id ${id}`); 
  } 
  return handleSuccess('wish list found', wishListDetails); 
}; 

exports.updateWishListById = async( id, customerId, updateBody) => {   
  const productExist = await commonFunctions.findByPk('product', updateBody.productId);
  if(!productExist){
      throw new BadRequestError(`Product not found with id ${updateBody.productId}`);
  }
  const verifyIfExistWishlistProduct = await commonFunctions.findOne('wishList', { condition : { productId: updateBody.productId, customerId } });
    if(verifyIfExistWishlistProduct){
        await commonFunctions.destroy('wishList', { id: verifyIfExistWishlistProduct.id });
        return handleSuccess('Product Removed from the wishlist.');
    }
  const wishListUpdate = await commonFunctions.update('wishList', { id: id, customerId }, updateBody);
  if (wishListUpdate[0] !== 1) { 
    throw new BadRequestError(`No wish list found with Id ${id}`); 
  } 
  return handleSuccess('Wish list updated successfully');
}; 

exports.deleteWishListById = async(id, customerId) => { 
  if(!id){
    throw new ValidationError('Id is required');
  }
  const removedWishList = await commonFunctions.destroy('wishList', { id, customerId });
  if (!removedWishList) { 
    throw new NoDataFoundError(`No wish list found with Id ${id}`); 
  } 
  return handleSuccess('Wish list deleted'); 
}; 
