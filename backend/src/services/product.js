/* eslint-disable max-lines-per-function */
/* eslint-disable max-len */
const db = require('../models');
const handleSuccess = require('../../utils/successHandler');
const { NoDataFoundError, ValidationError, InternalServerError, BadRequestError } = require('../../utils/customError');
const commonFunctions = require('../../utils/commonFunctions');
const _ = require('lodash');
const { Op } = require('sequelize');
const moment = require('moment');
const { fetchAllRelatedDiscounts, isAdmin } = require('../../utils/helperFunctions/product');
const redisClient = require('../../utils/redis');
const { TAG_PRODUCT_REDIS_KEY, offer } = require('../../utils/constant');


exports.createProduct = async(productData) => {

  // update the expiry date
  const momentExpiryDate = moment.utc(productData.expiryDate, 'YYYY-MM-DD').toDate();
  productData.expiryDate = momentExpiryDate;
  const { fileIds, vendorId, subCategoryId, name, brand, tags } = productData;
  if(!fileIds || fileIds.length == 0){
    throw new ValidationError('Please provide images of product');
  }

  delete productData.fileIds;

  // vendor validation
  if (!vendorId && !(await isAdmin(creator))) throw new ValidationError('Vendor is required');
  const vendorDetails = await commonFunctions.findOne('vendor', { condition: { id: vendorId } });
  if(vendorDetails.status !== 'approved') {
    throw new ValidationError('Vendor is not approved');
  }

  // product offer validation and insertion
  if(productData.offerId){
    const offerExist = commonFunctions.findByPk('offer', productData.offerId, { condition: { 
      approvalStatus: offer.APPROVAL_STATUS.APPROVED,
      status: offer.INAPP_STATUS.ACTIVE
    }});
    if(!offerExist){
      throw new ValidationError(`No active offer found with id ${offerId}`);
    }
  }

  // add product
  const addProduct = await commonFunctions.create('product', productData);
  if (!addProduct) {
    throw new InternalServerError('Internal server error');
  }

  if(productData.offerId){
    const productOffer = await commonFunctions.create('offerProduct', { offerId: productData.offerId, productId: addProduct.id });
      if (!productOffer) {
      throw new InternalServerError('Internal server error');
    }
  }

  const subCategoryDetails = await commonFunctions.findOne('subCategory', { condition: { id: subCategoryId } });
  const subCategoryName = subCategoryDetails?.name || '';
  await this.updateGlobalTagMap(name, brand, subCategoryName, tags);

  // add images of the product
  const imageRecords = fileIds.map((item) => ({
    fileId: item,
    productId: addProduct.id,
  }));

  await commonFunctions.create('productImage', imageRecords, true); // bulk create

  const productDetails = await commonFunctions.findOne('product', {
    condition: { id: addProduct.id },
    include: { 
      model: db.productImage, 
      as: 'images',
      attributes: ['id'],
      include: {
        model: db.fileUpload,
        as: 'imageDetails',
        attributes: ['id', 'path']
      }
    },
  });

  return handleSuccess('Product created', productDetails);
};

exports.fetchProductList = async(query, vendorData) => {
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
    ...(search && {
      [Op.or] : [
        { name : { [Op.iLike]: `%${search}%` } },
        { brand : { [Op.iLike]: `%${search}%` } },
        { description : { [Op.iLike]: `%${search}%` } },
      ],
    }),
    ...( vendorData ? { vendorId: vendorData.vendorId } : {} ) // filter products for the vendor
  }

  options.include = [
    { 
      model: db.productImage, 
      as: 'images',
      attributes: ['id'],
      include: {
        model: db.fileUpload,
        as: 'imageDetails',
        attributes: ['id', 'path'],
      },
    },
    {
      model: db.offerProduct,
      as: 'offerProducts',
      attributes: ['id', 'priority'],
      include: {
        model: db.offer,
        as: 'offer',
        attributes: ['id','name', 'discountType', 'discountValue', 'status'],
      },
    },
    {
      model: db.vendor,
      as: 'vendor',
      attributes: ['id', 'userName']
    },
  ];
  options.offset = offset;
  options.limit = limit;
  options.order = [['createdAt', 'DESC']];
  options.distinct = true;

  const fetchedProducts = await commonFunctions.findAll('product', options);

  if (fetchedProducts.count == 0) {
    throw new NoDataFoundError('Data Not Found');
  }

  return handleSuccess('Product List Fetched', fetchedProducts);
};

exports.fetchProduct = async(id, vendorData) => {
  let condition = { id, deletedAt: null };
  if (vendorData) {
    const { isVendor, vendorId } = vendorData;
    condition = {
      ...condition,
      ...(vendorId && isVendor && { vendorId }),
    };
  }
  const result = await commonFunctions.findOne('product', {
    condition,
    include: [
      { 
        model: db.productImage, 
        as: 'images',
        attributes: ['id'],
        include: {
          model: db.fileUpload,
          as: 'imageDetails',
          attributes: ['id', 'path'],
        },
      },
      {
        model: db.offerProduct,
        as: 'offerProducts',
        required: false,
        attributes: ['offerId', 'productId', 'status', 'priority'],
        include: {
          model: db.offer,
          as: 'offer',
          required: false,
          attributes: ['name', 'type', 'discountType', 'discountValue', 'status'],
          include: {
            model: db.offerSlab,
            as: 'offerSlabs',
            required: false,
            attributes: ['id', 'offerId', 'minPrice', 'maxPrice', 'minDiscount', 'maxDiscount', 'status'],
          },
        },
      },{
        model: db.subCategory,
        as: 'subCategory',
        attributes: ['name'],
        include: {
          model: db.category,
          as: 'category',
          attributes: ['name'],
        },
      },{
        model: db.vendor,
        as: 'vendor',
        attributes: {
          exclude: ['id', 'licenseId', 'rejectionReason'],
        },
      },
    ],
  });

  if (!result) {
    throw new NoDataFoundError('Data Not Found');
  }

  const plainProduct = result.toJSON();
  const discountInfo = fetchAllRelatedDiscounts(plainProduct, {
    filterPriority: null,
    isList: false,
  });
  delete plainProduct.offerProducts;

  return handleSuccess('Product Fetched', {
    ...plainProduct,
    discountInfo,
  });
};

exports.alterProduct = async({
  id, name, price, momentExpiryDate, creator,
  fileIds, subCategoryId, isPrescriptionRequired, vendorId, quantity, offerId
}, vendorData) => {
  const product = await commonFunctions.findOne('product', {
    condition: { id },
  });

  if (!product) {
    throw new NoDataFoundError('Product not found');
  }

  // check if there is update product offer
  if(offerId){
    const isProductExistInOffer = await commonFunctions.findOne('offerProduct', { condition: { productId: id }});
    if(!isProductExistInOffer){
      await commonFunctions.create('offerProduct',{ offerId, productId:id });
    }else{
    const updateOffer = await commonFunctions.update('offerProduct', { productId: id }, { offerId });
    if(updateOffer[0] === 0){
      throw new BadRequestError("Internal Server Error");
    }
    }
  }

  if (Array.isArray(fileIds) && fileIds.length > 0) {
    const imageRecords = fileIds.map(fileId => ({
      fileId,
      productId: id,
    }));
    await commonFunctions.create('productImage', imageRecords, true); // bulkCreate
  }

  const updateData = _.pickBy({
    name,
    price,
    expiryDate: momentExpiryDate,
    userId: creator,
    subCategoryId,
    isPrescriptionRequired,
    vendorId,
    quantity,
  }, v => v !== undefined);

  if (vendorData) {
    const { isVendor, vendorId } = vendorData;
    if (isVendor && product.vendorId !== vendorId) {
      throw new ValidationError('You don\'t have permission for this!!!');
    } 
  }
  const updatedRows = await commonFunctions.update('product', { id }, updateData);

  if (updatedRows[0] === 0) {
    throw new InternalServerError('Internal server error');
  }

  const updatedProduct = await commonFunctions.findOne('product', {
    condition: { id },
    include: { model: db.productImage, as: 'images' },
  });

  return handleSuccess('Product updated', updatedProduct);
};

exports.discardProduct = async(id) => {
  const result = await commonFunctions.destroy('product', { id });
  await commonFunctions.destroy('productImage', { productId: id });

  if (!result) {
    throw new NoDataFoundError('Data Not Deleted');
  }
  // also delete the products from the cart of the customer which is deleted.
  await commonFunctions.destroy('cartItem', { productId: id });

  return handleSuccess('Product Deleted', result);
};

exports.discardProductImages = async({ fileIds, productId }) => {
  const deletePromises = fileIds.map(fileId =>
    commonFunctions.destroy('productImage', { fileId, productId }),
  );
  const result = await Promise.all(deletePromises);
  if (result) {
    return handleSuccess('Product Image Deleted', result);
  }
  throw new NoDataFoundError('Data Not Deleted');
};

exports.updateGlobalTagMap = async(productName, brandName, subCategoryName, tags = []) => {
  const cleanTags = [...new Set(tags.map(t => t.trim().toLowerCase()))];
  
  // get tag map object from the redis
  const redisData = await redisClient.get(TAG_PRODUCT_REDIS_KEY);
  const tagMap = redisData ? JSON.parse(redisData) : {};

  // add tags in product name, brand name and sub category name
  updateKey(tagMap, productName.toLowerCase(), cleanTags);
  updateKey(tagMap, brandName.toLowerCase(), cleanTags);
  updateKey(tagMap, subCategoryName.toLowerCase(), cleanTags);

  // set new tag map to the redis as well as database
  await redisClient.set(TAG_PRODUCT_REDIS_KEY, JSON.stringify(tagMap));
  await db.appSetting.update({ value: JSON.stringify(tagMap), isActive: true }, { where: { key: TAG_PRODUCT_REDIS_KEY } });
};

const updateKey = (tagMap, key, cleanTags) => {
  if (!tagMap[key]){
    tagMap[key] = [];
  }
  let tagMapSet = new Set([...tagMap[key], ...cleanTags]);
  tagMap[key] = Array.from(tagMapSet);
};

exports.fetchCategoryProductsService = async(categoryId) => {
  const options = {};
  options['condition'] = { id: categoryId };
  options['include'] = [
    {
      model: db.subCategory,
      as: 'subCategory',
      attributes: ['id', 'name'],
      include: [
        {
          model: db.product,
          as:'products',
          attributes: ['id', 'name'],
          include: [
            {
              model: db.offerProduct,
              as: 'offerProducts',
              attributes: ['id'],
              where : { status: 'active' },
              required: false,
              include: [
                {
                  model: db.offer,
                  as: 'offer',
                  where : { status: 'active' },
                  required: false,
                  attributes: ['discount_value', 'discount_type'],
                },
              ],
            },
            {
              model: db.productImage,
              as: 'images', 
              attributes: ['id'],
              include: [
                {
                  model: db.fileUpload,
                  attributes: ['path'],
                  as:'imageDetails',
                },
              ],
            },
          ],
        },
        {
          model: db.subCategoryImage,
          as: 'images',
          attributes: ['id'],
          include: [
            {
              model: db.fileUpload,
              attributes: ['path'],
              as:'imageDetails',
            },
          ],
        },
      ],
    },
    {
      model: db.categoryImage,
      as: 'images', 
      attributes: ['id'],
      include: [
        {
          model: db.fileUpload,
          attributes: ['id', 'path'],
          as: 'imageDetails',
        },
      ],
    },
  ];

  const fetchCategory = await commonFunctions.findOne('category', options);
  if(!fetchCategory){
    throw new NoDataFoundError('No Products Found Based on this Category');
  };
  return handleSuccess('List all the products by Categories', fetchCategory);
};

exports.fetchProductForMobile = async(id) => {
  let condition = { id };
  const result = await commonFunctions.findOne('product', {
    condition,
    include: [
      { 
        model: db.productImage, 
        as: 'images',
        attributes: ['id'],
        include: {
          model: db.fileUpload,
          as: 'imageDetails',
          attributes: ['id', 'path'],
        },
      },
      {
        model: db.offerProduct,
        as: 'offerProducts',
        where: { status: 'active' },
        required: false,
        attributes: ['offerId', 'productId', 'status', 'priority'],
        include: {
          model: db.offer,
          as: 'offer',
          where: { status: 'active' },
          required: false,
          attributes: ['name', 'type', 'discountType', 'discountValue', 'status']
        },
      },{
        model: db.subCategory,
        as: 'subCategory',
        attributes: ['id','name'],
        include: {
          model: db.category,
          as: 'category',
          attributes: ['id','name'],
        },
      },
    ],
  });
  
  if (!result) {
    throw new NoDataFoundError('Data Not Found');
  };
 
const reviewStats =  await commonFunctions.findOne('productReview',{ condition: { productId: id }, attributes: [ [db.Sequelize.literal('ROUND(AVG(rating), 2)'), 'avgRating'],
    [db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'reviewCount']], raw: true  });

  const formattedProductResponse = {
    id: result.id,
    brand: result.brand,
    tags: result?.tags || null,
    name: result.name ,
    description: result?.description || null,
    price: result.price,
    expiryDate: result.expiryDate,
    quantity: result.quantity,
    weight: result.weight,
    unit: result.unit,
    images: result?.images?.map((data)=> ({
      id: data.id,
      imagePath: data?.imageDetails?.path
    })) || [],
    offerValue: result.offerProducts[0]?.offer?.discountValue || null,
    offerType: result.offerProducts[0]?.offer?.discountType || null,
    totalDiscount: result.offerProducts[0]?.offer?.discountType === 'percentage' ? (result.price * result.offerProducts[0]?.offer?.discountValue) / 100 || 1 : result.offerProducts[0]?.offer?.discountValue || 0, 
    subCategory: {
      id: result.subCategory?.id || null,
      name: result.subCategory?.name || null,
    },
    category: {
      id:  result.subCategory?.category?.id || null,
      name:  result.subCategory?.category?.name || null
    },
    productOverAllRating: reviewStats.avgRating,
    totalUserReview: reviewStats.reviewCount,
    isPrescriptionRequired: result?.isPrescriptionRequired || false
  };
  return handleSuccess('',formattedProductResponse);
}