/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
const { NoDataFoundError } = require('../../utils/customError');
const handleSuccess = require('../../utils/successHandler');
const commonFunctions = require('../../utils/commonFunctions');
const db = require('../../src/models');
const { sortingOrder } = require('../../utils/constant');
const { getAppConfig } = require('../../utils/redisConstants');
const { Op } = require('sequelize');
const { formattedProductResponse } = require('../../utils/helperFunctions/formattedProduct');
const { getPagination } = require('../../utils/pagination');
// const { sequelize } = require('../../src/models');
// const { getPagination } = require('../../utils/pagination');
// const moment = require('moment');

/**
 * products :- show as per appSettings configurable number and on view all show (DASHBOARD_SCREEN_MAX_ITEMS, per_brand_max)
 * customer:- (address location)
 * popular categories:- maintain json for categories in customer, (update when customer successfully buys a product)
 * offer - best offers with max discount , and other offers (best_deal_bar_value)
 */
exports.dashBoard = async(query, customerData, customerId) => {
  const appConstants = await getAppConfig();
  const products = await commonFunctions.findAll('product', {
    condition: {
      deletedAt: null,
      expiryDate: {
        [Op.gte]: new Date(),
      },
    },
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
        attributes: ['id', 'priority'],
        where : { status: 'active' },
        required: false,
        include: {
          model: db.offer,
          as: 'offer',
          where : { status: 'active' },
          required: false,
          attributes: ['name', 'type', 'discountType', 'discountValue', 'status'],
        },
      },
    ],
    order: [['expiryDate', sortingOrder.ASC]],
  });
  const productIds = products.rows.map((data) => data.id);
  const wishListOptions = {};
  wishListOptions['condition'] = { productId: { [Op.in]: productIds }, customerId };
  const wishList = await commonFunctions.findAll('wishList', wishListOptions);
  const wishListArr = wishList.rows.map((data) => data.productId);
  // const customerDetails = await commonFunctions.findOne('customer', { 
  //   condition: { id: customerData.id },
  //   attributes: ['id', 'categoryPreferences'],
  //   include: { 
  //     model: db.customerAddress, 
  //     as: 'customerAddress', 
  //     attributes: ['id', 'address'] },
  // });

  const result = {
    products: formattedProductResponse(products, wishListArr),
    title: appConstants.DASHBOARD_TITLE,
    // customerDetails,
  };
  
  return handleSuccess('', [result]);
};

exports.fixedCategoriesService = async() => {
  const appSetting = await getAppConfig();
  const arr = [];
  const fixedCategoriesObj = {};
  const constantData = JSON.parse(appSetting.FIXED_DISCOUNT_CATEGORIES);
  for(let i=0;i<constantData.length;i++){
    arr.push(constantData[i].key);
    fixedCategoriesObj[constantData[i].key] = constantData[i].value;
  };
  const options = {};
  options['condition'] = { name: { [Op.in] : arr } };
  options['attributes'] = ['id','name'];
  options['include'] = [{ model: db.categoryImage, as: 'images', attributes: ['id'], include: { model: db.fileUpload, as: 'imageDetails' , attributes: ['path'] } }];

  const fixedCategories = await commonFunctions.findAll('category', options);
  const result = [];
  for(let i=0;i<fixedCategories?.rows.length;i++){
    const data = fixedCategories.rows[i];
    const rowData = {};
    rowData['id'] = data.id;
    rowData['name'] = data.name;
    rowData['discount'] = fixedCategoriesObj[data.name];
    rowData['url'] = data.images[0]?.dataValues?.imageDetails?.dataValues?.path || null;
    result.push(rowData);
  }
  return handleSuccess('Fetched all the fixed Categories Successfully', result);
};

exports.popularCategoriesService = async() => {
  //// Note ------>>> for just temporary changes we are doing this.
  const appSetting = await getAppConfig();
  const result = [];
  const options = {};
  options['attributes'] = ['id','name'];
  options['include'] = [{ model: db.categoryImage, as: 'images', attributes: ['id'], include: { model: db.fileUpload, as: 'imageDetails' , attributes: ['path'] } }];
  const fetchPopularCategories = await commonFunctions.findAll('category', options);
  for(let i=0;i<fetchPopularCategories?.rows.length;i++){
    const data = fetchPopularCategories.rows[i];
    const rowData = {};
    rowData['id'] = data.id;
    rowData['name'] = data.name;
    rowData['url'] = data.images[0]?.dataValues?.imageDetails?.dataValues?.path || null;
    result.push(rowData);
  }
  return handleSuccess('Fetched all the popular categories successfully', result);
};

exports.bestDealsService = async({ page, limit }) => {
  const appSetting = await getAppConfig();
  const { pageLimit, offset } = getPagination({ page, limit });
  const options = {};
  options.include = [
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
      model: db.offerProduct,
      as: 'offerProducts',
      where : { status: 'active' },
      required: false,
      include: [
        {
         model: db.offer,
          as: 'offer',
          where: {
            discountValue: { 
              [Op.gte]: appSetting.BEST_DEAL_BAR_VALUE
            },
           status: 'active' ,
          },
          required:true,
        }
      ]
     
    }
  ]
  options['limit'] = pageLimit;
  options['offset'] = offset;
  const result = await commonFunctions.findAll('product', options);
  return handleSuccess('Fetched all best deals successfully', formattedProductResponse(result));
};

exports.commonDealsService = async() => {
  const appSetting = await getAppConfig();
  const commonDeals = await commonFunctions.findAll('offer', {
    condition: {
      deletedAt: null,
      discountValue: {
        [Op.lt]: Number(appSetting.BEST_DEAL_BAR_VALUE),
      },
    },
  });
  const data = commonDeals.rows;
  return handleSuccess('Fetched all common deals successfully', data);
};

exports.fetchCampaigns = async() => {
  const options = {};
  options['condition'] = { 
    type: 'dashboard', 
    status: 'approved' 
  };
  options['include'] = [
    {
      model: db.fileUpload,
      as: 'imageDetails',
    }
  ];
  const result = await commonFunctions.findAll('campaign', options);
  if(result.rows.length === 0){
    throw new NoDataFoundError('No Dashboard Campaigns Found');
  }
  const formattedResponse = result.rows.map((data)=> ({
    id: data.id,
    image: data?.imageDetails?.path || null
  }))
  return handleSuccess('Dashboard Campaign Fetched Successfully', formattedResponse);

}