/* eslint-disable max-lines-per-function */
/* eslint-disable max-len */
const handleSuccess = require('../../utils/successHandler');
const commonFunctions = require('../../utils/commonFunctions');
const { Op, Sequelize } = require('sequelize');
const db = require('../models');


exports.dashBoardCount = async() => {
  const customerCount = await commonFunctions.count('customer', { condition: { deletedAt: null}});
  const orderCount = await commonFunctions.count('order', { condition: { deletedAt: null}});
  const pendingOrderCount = await commonFunctions.count('order', { condition: { deletedAt: null, paymentStatus: 'pending' }});
  const vendorCount = await commonFunctions.count('vendor', { condition: { deletedAt: null , status: 'approved' }} );
  const totalSale = await commonFunctions.sum('order', 'totalAmount', { condition: { deletedAt: null , paymentStatus: 'paid' }}); 

  let today = new Date();
  today.setHours(0, 0, 0, 0);
  today = new Date(today);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // customer growth as compared to yesterday
  const yesterDayCustomerCount = await commonFunctions.count('customer', { condition: { 
        deletedAt: null, 
        createdAt:{ [Op.between]: [yesterday, today] } 
    }});
  const todayCustomerCount = await commonFunctions.count('customer', { condition: { 
        deletedAt: null, 
        createdAt:{ [Op.between]: [today, new Date()] } 
    }});
  let customerGrowth = (todayCustomerCount - yesterDayCustomerCount) * 100 / (yesterDayCustomerCount ? yesterDayCustomerCount : 1);

  // order growth as compared to past week
  const lastWeekDay = new Date(today);
  lastWeekDay.setDate(lastWeekDay.getDate() - 7);
  const lastWeekOrderCount = await commonFunctions.count('order', { condition: {
        deletedAt: null,
        createdAt:{ [Op.between]: [lastWeekDay, today] } 
    }});
  const todayOrderCount = await commonFunctions.count('order', { condition: {
        deletedAt: null,
        createdAt:{ [Op.between]: [today, new Date()] } 
    }});
  const orderGrowth = (todayOrderCount - lastWeekOrderCount) * 100 / (lastWeekOrderCount ? lastWeekOrderCount : 1); 

  // sales growth as compared to yesterday
  const yesterdaySalesSum = await commonFunctions.sum('order', 'totalAmount', { condition: { 
        deletedAt: null , 
        paymentStatus: 'paid',
        updatedAt: { [Op.between]: [yesterday, today] }
    }});
  const todaySalesSum = await commonFunctions.sum('order', 'totalAmount', { condition: { 
        deletedAt: null , 
        paymentStatus: 'paid',
        updatedAt: { [Op.between]: [today, new Date()] }
    }});
  const salesGrowth = (todaySalesSum - yesterdaySalesSum) * 100 / (yesterdaySalesSum ? yesterdaySalesSum : 1);  

  // pending order growth as compared to yesterday
  const yesterdayPendingOrderCount = await commonFunctions.count('order', { condition: { 
        deletedAt: null , 
        paymentStatus: 'pending',
        updatedAt: { [Op.between]: [yesterday, today] }
    }});
  const todayPendingOrderCount = await commonFunctions.count('order', { condition: { 
        deletedAt: null , 
        paymentStatus: 'pending',
        updatedAt: { [Op.between]: [today, new Date()] }
    }});
  const pendingOrderGrowth = (todayPendingOrderCount - yesterdayPendingOrderCount) * 100 / (yesterdayPendingOrderCount ? yesterdayPendingOrderCount : 1); 

  // vendor growth as compared to yesterday
  const yesterdayVendorCount = await commonFunctions.count('vendor', { condition: { 
        deletedAt: null , 
        status: 'approved',
        approvedDate: { [Op.between]: [yesterday, today] }
    }});
  const todayVendorCount = await commonFunctions.count('vendor', { condition: { 
        deletedAt: null , 
        status: 'approved',
        approvedDate: { [Op.between]: [today, new Date()] }
    }});
  const vendorGrowth = (todayVendorCount - yesterdayVendorCount) * 100 / (yesterdayVendorCount ? yesterdayVendorCount : 1);

  const resultObject = {
    totalCustomer: customerCount,
    totalOrder: orderCount,
    totalSale: totalSale,
    totalPending:pendingOrderCount,
    totalVendor: vendorCount,
    customerGrowth,
    orderGrowth,
    salesGrowth,
    pendingOrderGrowth,
    vendorGrowth
  };

  return handleSuccess('Results fetched successfully.', resultObject);
};

exports.fetchTopProducts = async(query) => {
  let page = Number(query?.page) || 1;
  let limit = Number(query?.limit) || 10;
  const offset = (page - 1) * limit;

  const topProducts = await db.product.findAll({
    attributes: {
      include: [
        [Sequelize.fn('COUNT', Sequelize.col('productOrder.id')), 'count']
      ],
      exclude: ['createdAt', 'updatedAt', 'deletedAt']
    },
    include: [
      {
        model: db.orderDetail,
        as: 'productOrder',
        required: false,
        where: {
          deliveryStatus: 'delivered'
        },
        attributes: []
      },
      {
        model: db.productImage,
        as: 'images',
        attributes: ['id'],
        include: [
          {
            model: db.fileUpload,
            as: 'imageDetails',
            attributes: ['id', 'path']
          }
        ]
      },
      {
        model: db.subCategory,
        as: 'subCategory',
        attributes: ["id"],
        include: {
          model: db.category,
          as: 'category',
          attributes: ['name']
        }
      }
    ],
    group: [
      'product.id',
      'product.brand',
      'product.tags',
      'product.name',
      'product.description',
      'product.price',
      'product.expiry_date',
      'product.sub_category_id',
      'product.is_prescription_required',
      'product.vendor_id',
      'product.quantity',
      'product.unit',
      'product.weight',
      'subCategory.id',
      'subCategory.category.id',
      'subCategory.category.name',
      'images.id',
      'images->imageDetails.id',
    ],
    order: [['count', 'desc']],
    limit,
    offset,
    subQuery: false,
  });

  const result = await addrankingsAndRatingForProduct(topProducts);
  return handleSuccess('Results fetched successfully.', result);
}

exports.fetchExpiryAlertProduct = async(query) => {
  let page = Number(query?.page) || 1;
  let limit = Number(query?.limit) || 10;
  const offset = (page - 1) * limit;
  const options = {};
  options.condition = {
    expiryDate: {
      [Op.gt]: new Date()
    }
  }
  options.order = [['expiryDate', 'asc']]
  options.limit = limit;
  options.offset = offset;
  options.attributes = {
    exclude: ['createdAt', 'updatedAt', 'deletedAt']
  }
  options.include = [
    {
      model: db.subCategory,
      as: 'subCategory',
      attributes: ['id'],
      include: [
        {
          model: db.category,
          as: 'category',
          attributes: ['name']
        }
      ]
    },
    {
      model: db.productImage,
      as: 'images',
      attributes: ['id'],
      include: [
        {
          model: db.fileUpload,
          as: 'imageDetails',
          attributes: ['id', 'path']
        }
      ]
    }
  ]

  const nearExpiryProducts = await commonFunctions.findAll('product', options);

  return handleSuccess('Results fetched successfully.', nearExpiryProducts);
}

exports.yearlySales = async(query) => {
  let year = query?.year || new Date().getFullYear();
  const salesData = await db.order.findAll({
    attributes: [
      [Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('created_at')), 'month'],
      [Sequelize.fn('SUM', Sequelize.col('total_amount')), 'total']
    ],
    where: {
      paymentStatus: 'paid', 
      created_at: {
        [Op.between]: [
          new Date(`${year}-01-01`),
          new Date(`${year}-12-31`)
        ]
      }
    },
    group: [Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('created_at'))],
    order: [[Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('created_at')), 'ASC']]
  });

  return handleSuccess('Results fetched successfully.', salesData);
}

async function addrankingsAndRatingForProduct(topProducts){
  const result = [];
  const options = {};
  options.attributes =  [ 
    [db.Sequelize.literal('ROUND(AVG(rating), 2)'), 'avgRating'],
    [db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'reviewCount']
  ];
  options.raw = true;

  for(let i=0;i<topProducts.length;i++){
    result.push({ ...topProducts[i].dataValues });
    options.condition = { productId: topProducts[i].id };
    const reviewStats =  await commonFunctions.findOne('productReview', options);
    result[i].productOverAllRating = reviewStats.avgRating || 0;
    result[i].totalUserReview = reviewStats.reviewCount;
    result[i].growth = await calculateProductGrowth(topProducts[i].dataValues.id);
  }
  return result;
}

async function calculateProductGrowth(productId){
  let today = new Date();
  today.setHours(0, 0, 0, 0);
  today = new Date(today);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // product growth as compared to yesterday
  const yesterdaySalesSum = await commonFunctions.sum('orderDetail', 'totalPrice', { condition: { 
        deletedAt: null , 
        deliveryStatus: 'delivered',
        productId,
        updatedAt: { [Op.between]: [yesterday, today] }
    }});
  const todaySalesSum = await commonFunctions.sum('orderDetail', 'totalPrice', { condition: { 
        deletedAt: null , 
        deliveryStatus: 'delivered',
        productId,
        updatedAt: { [Op.between]: [today, new Date()] }
    }});

  const salesGrowth = (todaySalesSum - yesterdaySalesSum) * 100 / (yesterdaySalesSum ? yesterdaySalesSum : 1);

  return salesGrowth;
}