/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */
const handleSuccess = require('../../utils/successHandler');
const commonFunctions = require('../../utils/commonFunctions');
const { TAG_PRODUCT_REDIS_KEY } = require('../../utils/constant');
const redisClient = require('../../utils/redis');
const { Op } = require('sequelize');
const Fuse = require('fuse.js');
const { NoDataFoundError, BadRequestError } = require('../../utils/customError');
const db = require('../models');
const { formattedProductResponse, displayDashboardProductResponse, formattedProductRowsResponse } = require('../../utils/helperFunctions/formattedProduct');
const { getPagination } = require('../../utils/pagination');

exports.relevanceService = async(query) => {
  const { search } = query;
  const redisData = await redisClient.get(TAG_PRODUCT_REDIS_KEY);
  let keyValueData = redisData || null;

  if(!redisData) {
    const productToTagsMap = await commonFunctions.findOne('appSetting', 
      { 
        condition: { 
          key: TAG_PRODUCT_REDIS_KEY,
        },
      },
    );
    keyValueData = productToTagsMap.value;
    await redisClient.set(TAG_PRODUCT_REDIS_KEY, JSON.stringify(keyValueData));
  }
  if (!keyValueData) return handleSuccess('No data found', []);
  
  const productToTagsMap = JSON.parse(keyValueData);
  
  const tagToProductsMap = {};
  const allTags = new Set();
  
  for (const [product, tags] of Object.entries(productToTagsMap)) {
    for (const tag of tags) {
      const normalizedTag = tag.toLowerCase();
      allTags.add(normalizedTag);
        
      if (!tagToProductsMap[normalizedTag]) {
        tagToProductsMap[normalizedTag] = new Set();
      }
      tagToProductsMap[normalizedTag].add(product.toLowerCase());
    }
  }
  
  const tagsArray = Array.from(allTags);
  
  const fuse = new Fuse(tagsArray, {
    threshold: 0.4,
    includeScore: true,
  });
  
  const fuzzyResults = fuse.search(search.toLowerCase());
    
  const exactMatchProducts = tagToProductsMap[search.toLowerCase()]
    ? Array.from(tagToProductsMap[search.toLowerCase()])
    : [];
  
  const fuzzyMatchProducts = [];
  const matchedTags = new Set();
    
  for (const { item: matchedTag } of fuzzyResults) {
    if (!matchedTags.has(matchedTag)) {
      matchedTags.add(matchedTag);
      const products = tagToProductsMap[matchedTag];
      if (products) {
        fuzzyMatchProducts.push(...Array.from(products));
      }
    }
  }
  
  const result = [...new Set([...exactMatchProducts, ...fuzzyMatchProducts])];
  
  return handleSuccess('Success', {
    input: search,
    matchedTags: Array.from(matchedTags),
    result: result,
  });
};
  
exports.globalSearchSevice = async(query,customerId) => {
  const { search, page, limit } = query;
  const { pageLimit, offset } = getPagination({  page, limit })
  const options = {};
  let subCategoryDetails;
  let subCategoryProducts = [];

  if (search) {
    subCategoryDetails = await commonFunctions.findOne('subCategory', {
      condition: { name: { [Op.iLike]: `%${search}%` } },
    });

    const orConditions = [
      { name: { [Op.iLike]: `%${search}%` } },
      { brand: { [Op.iLike]: `%${search}%` } },
    ];

    if (subCategoryDetails) {
      subCategoryProducts = await commonFunctions.findAll('product', {
        condition: { subCategoryId: subCategoryDetails.id }, include: [ 
          {
            model: db.productImage,
            as: 'images',
            include: [
              {
                model: db.fileUpload,
                as: 'imageDetails'
              },
            ]
          },
          {
            model: db.offerProduct,
            as: 'offerProducts',
            where: { status: 'active' },
            required: false,
            include: [
              {
                model: db.offer,
                as: 'offer',
                where: { status: 'active' },
                required: false,
              }
            ]
          }
        ]
      });
    }

    options.condition = {
      [Op.or]: orConditions,
    };
     options.include =  [ 
          {
            model: db.productImage,
            as: 'images',
            include: [
              {
                model: db.fileUpload,
                as: 'imageDetails'
              },
            ]
          },
          {
            model: db.offerProduct,
            as: 'offerProducts',
             where: { status: 'active' },
          required: false,
            include: [
              {
                model: db.offer,
                as: 'offer',
                 where: { status: 'active' },
          required: false,
              }
            ]
          }
        ];
  }
 
  const products = await commonFunctions.findAll('product', options);
  const mergedProducts = [
    ...(products?.rows || []),
    ...(subCategoryProducts?.rows || []),
  ];

  const uniqueProductsMap = new Map();
  for (const product of mergedProducts) {
    uniqueProductsMap.set(product.id, product); // Or another unique identifier
  }

  const result = Array.from(uniqueProductsMap.values());
  if (result.length === 0) throw new BadRequestError('Products unavailable at this moment!!!');
    const productIds = result.map((data) => data.id);
  const wishList = await commonFunctions.findAll('wishList', { condition: { customerId, productId: {[Op.in]:productIds}}});
  const wishListArr = wishList.rows.map((data)=> data.productId);
  const totalResponses =  products?.count || 0 + subCategoryProducts?.count || 0
  const finalResult = {
      page,
      limit,
      totalResponses,
      totalPages: Math.ceil(totalResponses / limit),
      responses: formattedProductRowsResponse(result, wishListArr),
      }
  return handleSuccess('Search results fetched', finalResult);
};

exports.randomProducts = async(id) => {
  let options = {};
  if(!id){
    options['include'] = [
      {
        model: db.productImage,
        as: 'images',
        include: [
          {
            model: db.fileUpload,
            as:'imageDetails',
          },
        ],
      },
      {
        model: db.offerProduct,
        as: 'offerProducts',
         where: { status: 'active' },
          required: false,
        attributes: ['id', 'priority'],
        include: {
          model: db.offer,
          as: 'offer',
           where: { status: 'active' },
          required: false,
          attributes: ['name', 'type', 'discountType', 'discountValue', 'status'],
        },
      },
    ];
    options['order'] = db.sequelize.random();
    options['limit'] = 3;
    const products = await commonFunctions.findAll('product',options);
    if(products.length === 0){
      throw new NoDataFoundError('No Products found');
    }
    return handleSuccess('',formattedProductResponse(products));
  }
  options['condition'] = { id };
  options['include'] = [
    {
      model: db.product,
      as: 'products',
      include: [
        {
          model: db.productImage,
          as: 'images',
          include: [
            {
              model: db.fileUpload,
              as:'imageDetails',
            },
          ],
        },
        {
          model: db.offerProduct,
          as: 'offerProducts',
           where: { status: 'active' },
          required: false,
          attributes: ['id', 'priority'],
          include: {
            model: db.offer,
            as: 'offer',
             where: { status: 'active' },
          required: false,
            attributes: ['name', 'type', 'discountType', 'discountValue', 'status'],
          },
        },
      ],
            
      order: db.sequelize.random(),
      limit: 3,
    },
  ];
  const checkifSubCategory = await commonFunctions.findOne('subCategory', options);
  if(checkifSubCategory){
    const formattedResponse = {
      id: checkifSubCategory.id,
      name: checkifSubCategory.name,
      categoryId: checkifSubCategory.categoryId,
    };
    formattedResponse['products'] = displayDashboardProductResponse(checkifSubCategory?.products || []);
    return handleSuccess('Sub Category based product found',formattedResponse);
  };
  
  throw new NoDataFoundError('Invalid Id for SubCategory');
};