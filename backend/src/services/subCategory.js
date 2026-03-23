/* eslint-disable max-len */
const db = require('../models');
const { InternalServerError, NoDataFoundError, BadRequestError } = require('../../utils/customError');
const handleSuccess = require('../../utils/successHandler');
const commonFunctions = require('../../utils/commonFunctions');
const { getPagination } = require('../../utils/pagination');
const { Op } = require('sequelize');
const { formattedProductResponse } = require('../../utils/helperFunctions/formattedProduct');
const { sortEnum } = require('../../utils/helperFunctions/sortEnum');
const { getAppConfig } = require('../../utils/redisConstants');

exports.createSubCategory = async(subCategoryData, subCategoryImage) => {
  if(!subCategoryImage || subCategoryImage.length == 0){
    throw new ValidationError('Please provide images of sub category');
  }
  const subCategory = await commonFunctions.create('subCategory', subCategoryData);
  if(!subCategory) {
    throw new InternalServerError('Internal server error');
  } 
  const imageData = [];
  for(let i=0;i<subCategoryImage.length;i++){
    imageData.push({
      subCategoryId: subCategory.id,
      imageId: subCategoryImage[i]
    })
  }

  await commonFunctions.create('subCategoryImage', imageData, isBulk = true);
  return handleSuccess('Sub Category Added', subCategory);
};

exports.fetchSubCategoryList = async(query) => {
  let page = Number(query.page) || 1;
  let limit = Number(query.limit) || 10;
  let offset = (page - 1) * limit;
  const search = query.search || '';
  const options = {};

  // remove the pagination when allRecords = true
  if(query.allRecords){
    offset = null;
    limit = null;
  }
  options.condition = { 
    ...(search && { name : { [Op.iLike]: `%${search}%` } })
  };
  options.include = [
    { 
      model: db.category, 
      as: 'category', 
    },
    { 
      model: db.subCategoryImage, 
      as: 'images',
      attributes: ['id'],
      include: {
        model: db.fileUpload,
        as: 'imageDetails',
        attributes: ['id', 'path'],
      },
    },
  ];
  options.offset = offset;
  options.limit = limit;
  options.distinct = true;
  const subCategoryData = await commonFunctions.findAll('subCategory', options);
  if(subCategoryData.rows.length === 0) {
    throw new NoDataFoundError('No Sub Categories Found');
  } 
  return handleSuccess('Sub Categories Fetched Successfully', subCategoryData);
};

exports.fetchSubCategory = async(subCategoryData) => {
  const { id } = subCategoryData;
  const result = await commonFunctions.findOne('subCategory', { 
    condition: { id, deletedAt: null },
    include: { model: db.category, as: 'category' },
  });

  if(!result) {
    throw new NoDataFoundError('No Sub Category Found');
  } 
  return handleSuccess('Sub Category Fetched Successfully', result);
};

exports.alterSubCategory = async(id, subCategoryData, fileId) => {
  const result = await commonFunctions.findOne('subCategory', { id } );
  if (!result) {
    throw new NoDataFoundError('No Sub categories Found');
  } 
  if(subCategoryData.name || subCategoryData.categoryId){
    const updateSubCategory = await commonFunctions.update('subCategory', { id }, subCategoryData);
    if(updateSubCategory[0] !== 1) {
      throw new InternalServerError('Internal server error');
    } 
  }

  if(fileId){
    const updateImage = await commonFunctions.update('subCategoryImage', { subCategoryId: id }, { imageId: fileId });
    if(updateImage[0] !== 1) {
      throw new InternalServerError('Internal server error');
    }
  }
  return handleSuccess('Sub Category Updated Successfully');
};

exports.discardSubCategory = async(id) => {
  const result = await commonFunctions.destroy('subCategory', { id });
  if(!result) {
    throw new InternalServerError('Internal server error');
  } 
  return handleSuccess('Sub Category Deleted Successfully', result);
};

exports.fetchSubCategoryProducts = async(data) => {
  const { subCategoryId, page = 1, limit = 10, customerId, sort = null, isMaxSaver } = data;
  const appSetting = await getAppConfig()
  if(sort && !sortEnum[sort]){
    throw new BadRequestError(`No Sorting Option found for ${sort} option.`);
  }
  const { pageLimit, offset } = getPagination({ page,limit });
  let options = {};
  let isDiscount = false;

  switch (sort) {
  case 'relevance':
    options = sortByRelevance({}, isMaxSaver, appSetting.MAX_SAVE);
    break;
  case 'pl':
    options = sortByPriceLowToHigh({}, isMaxSaver, appSetting.MAX_SAVE);
    break;
  case 'ph':
    options = sortByPriceHighToLow({}, isMaxSaver, appSetting.MAX_SAVE);
    break;
  case 'discount':
    isDiscount = true;
    options = sortByDiscount({}, isMaxSaver, appSetting.MAX_SAVE, subCategoryId, customerId);
    break;
  default:
    options = sortByNoFilter({}, isMaxSaver, appSetting.MAX_SAVE);
    break;
}

  if(!isDiscount){
    options['condition'] = { subCategoryId };
    options['attributes'] = ['id','name','quantity','price','weight','unit','createdAt','isPrescriptionRequired'];
  }
  options['limit'] = pageLimit;
  options['offset'] = offset;
  options.subQuery = false;
  

  let result;
  if(isDiscount){
    result = await commonFunctions.findAll('offerProduct', options);
  }else{

    result = await commonFunctions.findAll('product', options);
  }
  if(result.rows.length === 0){
    throw new NoDataFoundError('No Products found based on this subcategories');
  };
  let finalResult;
  if(!isDiscount){
  const productIds = result.rows.map((data) => data.id);
  const wishListOptions = {};
  wishListOptions['condition'] = { productId: { [Op.in]: productIds }, customerId };
  const wishList = await commonFunctions.findAll('wishList', wishListOptions);
  const wishListArr = wishList.rows.map((data) => data.productId);
  finalResult = {
    page,
    limit,
    totalResponses: result.count,
    totalPages: Math.ceil(result.count / limit),
    responses: formattedProductResponse(result, wishListArr),
  };
  }else{
  const formattedResponse = result.rows.map((data) => ({
      id: data?.productId,
      name: data?.product?.name,
      price: data?.product?.price,
      quantity: data?.product?.quantity,
      image: data?.product?.images[0]?.imageDetails?.path || null,
      offerValue: data?.offer?.discountValue || null,
      offerType: data?.offer?.discountType || null,
      totalDiscount: data.offer?.discountType === 'percentage' ? ( data?.product?.price * 100 ) / data?.offer?.discountValue || 1: data.offer?.discountValue || 0,
      isWishlisted: data.product.wishList !== null ? true: false,
      unit: data?.product?.unit,
      weight: data?.product?.weight,
      createdAt: data?.product?.createdAt,
      isPrescriptionRequired: data?.product?.isPrescriptionRequired
  }))
   finalResult = {
    page,
    limit,
    totalResponses: result.count,
    totalPages: Math.ceil(result.count / limit),
    responses: formattedResponse,
  };
  }
 
 

  return handleSuccess('SubCategory Products found', finalResult);
};

function getBaseIncludes(isMaxSaver, maxSave, isDiscount = false) {
  const offerInclude = {
    model: db.offer,
    as: 'offer',
    attributes: ['discountValue', 'discountType'],
  };
  if(isDiscount){
    offerInclude.required = true;
    offerInclude.where = { status: 'active' }
  }

  if (isMaxSaver) {
    offerInclude.where = { discountType: 'percentage', discountValue: { [Op.gte]: maxSave }, status: 'active' };
    offerInclude.required = true;
  }

  const offerProductInclude = {
    model: db.offerProduct,
    as: 'offerProducts',
    attributes: ['id'],
    where: { status: 'active' },
    required: false,
    include: [offerInclude],
  };

  const imageInclude = {
    model: db.productImage,
    as: 'images',
    attributes: ['id'],
    include: [
      {
        model: db.fileUpload,
        as: 'imageDetails',
        attributes: ['path'],
      },
    ],
  };

  return [offerProductInclude, imageInclude];
}

function sortByPriceLowToHigh(options = {}, isMaxSaver, maxSave) {
  options.include = getBaseIncludes(isMaxSaver, maxSave);
  options.order = [['price', 'ASC']];
  return options;
}

function sortByPriceHighToLow(options = {}, isMaxSaver, maxSave) {
  options.include = getBaseIncludes(isMaxSaver, maxSave);
  options.order = [['price', 'DESC']];
  return options;
}

function sortByDiscount(options = {},isMaxSaver, maxSave, subCategoryId,customerId) {
  // const includes = getBaseIncludes(isMaxSaver, maxSave, isDiscount = true);

  options.include = [
    {
      model: db.offer,
      as: 'offer',
      required: true,
    },
    {
      model: db.product,
      as: 'product',
      where : { subCategoryId },
      required: true,
      include: [
        {
          model: db.productImage,
          as: 'images',
          include: [
            {
              model: db.fileUpload,
              as: 'imageDetails',
            }
          ]
        },
        {
          model: db.wishList,
          as: 'wishList',
          where: { customerId },
          required: false,
        }
      ]
    }
  ]

options.order = [
  [db.Sequelize.literal(`"offer"."discount_value"`), 'DESC']
];

  return options;
}

function sortByRelevance(options = {}, isMaxSaver, maxSave) {
  const includes = getBaseIncludes(isMaxSaver, maxSave);
  includes.push({
    model: db.orderDetail,
    as: 'productOrder',
    where: { productId: { [Op.ne]: null } },
    required: true ,
    attributes: [],
  });

  options.include = includes;
  options.order = [['createdAt', 'DESC']];
  return options;
}

function sortByNoFilter(options = {}, isMaxSaver, maxSave) {
  options.include = getBaseIncludes(isMaxSaver, maxSave);
  options.order = [['createdAt', 'DESC']];
  return options;
}