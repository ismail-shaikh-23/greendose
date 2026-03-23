/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
const db = require('../src/models');
const redisClient = require('./redis');
const { NoDataFoundError } = require('./customError');
const { TAG_PRODUCT_REDIS_KEY } = require('./constant');
const { Op } = require('sequelize');

const formatConstants = async(constants) => {
  const formatted = {};
  for (const constant of constants) {
    formatted[constant.key] = constant.value || '';
  }
  return formatted;
};

const fetchAppConstants = async() => {
  try {
    const cachedConstants = await redisClient.get('appConstants');
    if (cachedConstants) {
      return JSON.parse(cachedConstants);
    }
    const constantsFromDb = await db.appSetting.findAll({
      where: {
        key: {
          [Op.ne]: TAG_PRODUCT_REDIS_KEY,
        },
      },
    });
    const formattedConstants = await formatConstants(constantsFromDb);

    await redisClient.set('appConstants', JSON.stringify(formattedConstants), {
      EX: 60 * 60 * 48, 
    });
    return formattedConstants;
  } catch (error) {
    throw new NoDataFoundError('Error fetching constants');
  }
};

const fetchProductTagMap = async() => {
  const products = await db.product.findAll({
    attributes: ['name', 'tags', 'subCategoryId', 'brand'],
    where: { deletedAt: null },
    include: {
      model: db.subCategory,
      as: 'subCategory',
      attributes: ['name'],
    },
  });
  const productTagMap = {};

  for (const product of products) {
    if(!product.tags){
      continue;
    }
    const tags = product.tags.map(t => t.trim().toLowerCase());

    const name = product.name?.trim()?.toLowerCase();
    const brand = product.brand?.trim()?.toLowerCase();
    const subCategoryName = product.subCategory?.name?.trim()?.toLowerCase();
    if (name) {
      if (!productTagMap[name]) productTagMap[name] = new Set();
      tags.forEach(tag => productTagMap[name].add(tag.toLowerCase()));
    }

    if (brand) {
      if (!productTagMap[brand]) productTagMap[brand] = new Set();
      tags.forEach(tag => productTagMap[brand].add(tag.toLowerCase()));
    }

    if (subCategoryName) {
      if (!productTagMap[subCategoryName]) { 
        productTagMap[subCategoryName] = new Set();
      }
      tags.forEach(tag => 
        productTagMap[subCategoryName].add(tag.toLowerCase()));
    }
  }

  const finalMap = {};
  for (const [key, tagSet] of Object.entries(productTagMap)) {
    finalMap[key] = Array.from(tagSet);
  }
  await redisClient.del(TAG_PRODUCT_REDIS_KEY);
  await redisClient.set(TAG_PRODUCT_REDIS_KEY, JSON.stringify(finalMap));
  db.appSetting.update({ value: JSON.stringify(finalMap), isActive: true }, { where: { key: TAG_PRODUCT_REDIS_KEY } });
  return finalMap;
};

exports.getAppConfig = async() => {
  const constants = await fetchAppConstants();
  return {
    BLOCKING_MODE: constants.blockingMode,
    MAX_ATTEMPT: constants.maxAttempt,
    DASHBOARD_SCREEN_MAX_ITEMS: constants.dashboardScreenMaxItems,
    BEST_DEAL_BAR_VALUE: constants.bestDealBarValue,
    FIXED_DISCOUNT_CATEGORIES: constants.fixedDiscountCategories,
    POPULAR_CATEGORY_GRID: constants.popularCategoryGrid,
    POPULAR_CATEGORY_ROW: constants.popularCategoryRow,
    DASHBOARD_TITLE: constants.dashboardTitle,
    DASHBOARD_SCREEN_MAX_ROWS: constants.dashboardScreenMaxRows,
    DASHBOARD_GRID: constants.dashboardGrid,
    CLEARANCE_TIME_LIMIT_DAYS: constants.clearanceTimeLimitDays,
    CLEARANCE_PRICE_TITLE: constants.clearancePriceTitle,
    DELIVERY_FEE : Number(constants.deliveryFee),
    HANDLING_CHARGES: Number(constants.handlingCharges),
    MAX_SAVE: Number(constants.maxSave),
    DASHBOARD_CAMPAIGN: constants.dashboardCampaign,
    CATEGORY_CAMPAIGN: constants.categoryCampaign,
    CUSTOMER_CAMPAIGN: constants.customerCampaign,
  };
};

exports.getFuzzyTagRelevance = async() => {
  const finalMap = await fetchProductTagMap();
  return {
    PRODUCT_TAG: finalMap,
  };
};

