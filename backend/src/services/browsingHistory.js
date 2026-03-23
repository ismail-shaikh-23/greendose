const db = require('../models'); 
const { sequelize } = db;
const { NoDataFoundError, BadRequestError, ValidationError, InternalServerError } = require('../../utils/customError'); 
const handleSuccess = require('../../utils/successHandler'); 
const commonFunctions = require('../../utils/commonFunctions');
const redisClient = require('../../utils/redis');
const { getPagination } = require('../../utils/pagination');
const { Op } = require('sequelize');


exports.insertBrowsingHistory = async (customerId, productId) => {
    const key = `Browsing:${customerId}${productId}`
     if (redisClient.isOpen) {
        let isPresentData = await redisClient.get(key);
        if (isPresentData) {
          return handleSuccess('Already In the database');
        } else {
          isPresentData = await commonFunctions.findOne('browsingHistory', { condition: { customerId, productId } });
          if (isPresentData){
            await redisClient.set(key, JSON.stringify(isPresentData), { EX: 86400 });
            return handleSuccess('Already In the database');
          }else{
            const data = await commonFunctions.create('browsingHistory', { customerId, productId });
                await redisClient.set(key, JSON.stringify(data), { EX: 86400 });
                return handleSuccess('Added in the database');
          }

        }
      } else {
        const checkIfExist = await commonFunctions.findOne('browsingHistory', {customerId,productId});
        if(checkIfExist){
            return handleSuccess('Already In the database')
        }
        const data = await commonFunctions.create('browsingHistory', { customerId, productId });
        await redisClient.set(key, JSON.stringify(data), { EX: 86400 });
        return handleSuccess('Added in the database');
      }
    
};

exports.fetchBrowsingHistory = async (customerId, query) => {
  const { page = 1, limit = 10} = query;
  const { pageLimit, offset } = getPagination({ page, limit });
  const options = {};
  options.condition = {
    customerId
  };
  options.offset = offset;
  options.limit = pageLimit;
  options.include = [
    {
      model: db.product,
      as: 'product',
      attributes: {
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
                where: { status : 'active' },
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
      }
    ],
    },
  ],
  options.offset = offset;
  options.limit = limit;
  options.distinct = true;
  options.subQuery = false;

  const result = await commonFunctions.findAll('browsingHistory', options);
  if (result.rows.length === 0) { 
    throw new NoDataFoundError('No Browsing History Found');
  } 
    const finalResult = {
    page,
    limit,
    totalResponses: result.count,
    totalPages: Math.ceil(result.count / limit),
    responses: result.rows?.map((data) => {

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
  return handleSuccess('Browsing History records fetched successfully', finalResult); 
};

exports.removeBrowsingHistory = async (id) => {
  const result = await commonFunctions.destroy('browsingHistory', { id });
  if (!result) { 
    throw new NoDataFoundError(`No Browsing History found with Id ${id}`); 
  } 
  return handleSuccess('Browsing history deleted'); 
}