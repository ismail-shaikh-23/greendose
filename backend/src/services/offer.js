/* eslint-disable max-len */
const moment = require('moment');
const { Op } = require('sequelize');

const { NoDataFoundError, BadRequestError, ValidationError, InternalServerError } = require('../../utils/customError'); 
const handleSuccess = require('../../utils/successHandler'); 
const commonfunctions = require('../../utils/commonFunctions');
const { offer, sortingOrder } = require('../../utils/constant');
const { slabCreations } = require('../../utils/helperFunctions/offer');
const db = require('../models');
const { sequelize } = db;
const { getAppConfig } = require('../../utils/redisConstants');
const { getPagination } = require('../../utils/pagination');
const { formattedProductResponse } = require('../../utils/helperFunctions/formattedProduct');

exports.createOffer = async(userId, offerData, vendorData) => {
  offerData.startDate = moment(offerData.startDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
  offerData.endDate = moment(offerData.endDate, 'YYYY-MM-DD').format('YYYY-MM-DD');

  // if(!offerData.fileIds || offerData.fileIds.length == 0){
  //   throw new ValidationError('Please provide images of product');
  // }// Commented not needed now

  const offerSlabInfo = offerData?.slabs || [];
  delete offerData.slabs;
  let body = { 
    ...offerData, 
    status: offer.INAPP_STATUS.INACTIVE, 
    createdBy: userId, 
    approvalStatus: offer.APPROVAL_STATUS.PENDING,
  };
  if (vendorData) {
    const { vendorId } = vendorData;
    body = {
      ...body,
      isVendor: true,
      vendorId,
    };
  }
  const createdoffer = await commonfunctions.create('offer', body);
  await slabCreations(createdoffer.id, offerSlabInfo);
  if (Array.isArray(offerData.fileIds) && offerData.fileIds.length > 0) {
    const imageRecords = offerData.fileIds.map((item) => ({
      fileId: item,
      offerId: createdoffer.id,
    }));
  
    await commonfunctions.create('offerMedia', imageRecords, true); // bulkCreate
  }
  if (!createdoffer) {
    throw new InternalServerError('Internal server error');
  }
  return handleSuccess('offer created sucessfully');
};

exports.fetchOfferList = async(query, vendorData) => { 
  const { fetchAll, sortField } = query;
  let page = Number(query.page) || 1;
  let limit = Number(query.limit) || 10;
  const offset = (page - 1) * limit;
  const search = query.search || '';
  const status = query.status;
  const options = {};
  
  options.condition = {
    ...(search && {
      [Op.or] : [
        { name : { [Op.iLike]: `%${search}%` } },
        { discountValue : { [Op.iLike]: `%${search}%` } },
        { type : { [Op.iLike]: `%${search}%` } },
        { approvalStatus : { [Op.iLike]: `%${search}%` } },
        { status : { [Op.iLike]: `%${search}%` } },
      ],
    }),
    ...(status? { status } : {} )
  };

  if (vendorData) {
    const { isVendor, vendorId, vendorUserId } = vendorData;
    options.condition = {
      ...options.condition,
      ...(vendorId && isVendor && { vendorId }),
      ...(vendorUserId && isVendor && { createdBy: vendorUserId }),
    };
  }

  options.offset = offset;
  options.limit = limit;
  options.sort = [sortField ? `${sortField}`: 'createdAt', sortingOrder.DESC];

  if(fetchAll === 'true') {
    delete options.limit;
    delete options.offset;
  }
  options.attributes = [
    "id", "name", "type", "discountType", "discountValue", "startDate", "endDate", "approvalStatus", "status", "vendorId", "rejectReason",
    [sequelize.literal(`"offerMedia->offerMediaDetails"."path"`), 'imagePath']
  ];
  options.include = [
    {
      model: db.vendor,
      as: 'offerVendor',
      attributes: ['id', 'organizationName'],
      required: false,
    },
    {
      model: db.offerMedia,
      as: 'offerMedia',
      attributes: [],
      include: {
        model: db.fileUpload,
        as: 'offerMediaDetails',
        attributes: []
      },
    },
  ];
  options.distinct = true; 
  options.subQuery = false;

  const offerRecords = await commonfunctions.findAll('offer', options);
  if (offerRecords.length === 0) { 
    throw new NoDataFoundError();
  } 
  return handleSuccess('offer found', offerRecords); 
}; 

exports.fetchOfferById = async(id, vendorData) => { 
  if(!id){
    throw new ValidationError('Id is required');
  }
  const options = {};
  options.condition = { id: id };
  if (vendorData) {
    const { isVendor, vendorId, vendorUserId } = vendorData;
    options.condition = {
      ...options.condition,
      ...(vendorId && isVendor && { vendorId }),
      ...(vendorUserId && isVendor && { createdBy: vendorUserId }),
    };
  }

  options.include = [
    {
      model: db.offerProduct,
      as: 'offerProducts',
      attributes: ['priority'],
    },
  ];
  const offerRecord = await commonfunctions.findOne('offer', options);
  if (!offerRecord) { 
    throw new NoDataFoundError(`No offer found with Id ${id}`); 
  } 
  return handleSuccess('offer found', offerRecord); 
}; 

exports.updateOfferById = async( id, userId, updateData, vendorData ) => { 
  const offerExist = await commonfunctions.findOne('offer', { condition : { id } });
  if (!offerExist) { 
    throw new NoDataFoundError(`No offer found with Id ${id}`); 
  } 
  if (vendorData) {
    const { isVendor, vendorId } = vendorData;
    if (isVendor && offerExist.vendorId !== vendorId) {
      throw new ValidationError('You don\'t have permission for this!!!');
    } 
  }
  let body = { ...updateData, updatedBy: userId };
  const updateRecord = await commonfunctions.update('offer', { id }, body);
  if (updateRecord[0] !== 1) { 
    throw new InternalServerError('Internal server error');
  } 
  return handleSuccess('offer updated'); 
}; 

exports.updateOfferStatusById = async( id, userId, updateData ) => { 
  const offerExist = await commonfunctions.findOne('offer', { condition : { id } });
  if (!offerExist) { 
    throw new NoDataFoundError(`No offer found with Id ${id}`); 
  } 
  let body = {};
  if (updateData.approvalStatus === offer.APPROVAL_STATUS.APPROVED) {
    body = { 
      approvalStatus: offer.APPROVAL_STATUS.APPROVED, 
      approvedBy: userId, 
      status: offer.INAPP_STATUS.ACTIVE,
      rejectReason: null,
      rejectedBy: null, 
    };
  } else {
    body = { 
      approvalStatus: offer.APPROVAL_STATUS.REJECTED, 
      rejectedBy: userId, 
      status: offer.INAPP_STATUS.INACTIVE, 
      rejectReason: updateData.rejectReason,
    };
  }
  const updateRecord = await commonfunctions.update('offer', { id }, body);
  await commonfunctions.update('offerProduct', { offerId: id }, { status: offer.INAPP_STATUS.INACTIVE });
  if (updateRecord[0] !== 1) { 
    throw new InternalServerError('Internal server error');
  } 
  return handleSuccess('offer updated'); 
}; 

exports.deleteOfferById = async(id) => { 
  if(!id){
    throw new ValidationError('Id is required');
  }
  const removedoffer = await commonfunctions.destroy('offer', { id });
  if (!removedoffer) { 
    throw new NoDataFoundError(`No offer found with Id ${id}`); 
  }  
  return handleSuccess('offer deleted'); 
}; 

exports.fetchClearanceOffers = async( page = 1, limit=10, customerId ) => {
  const { pageLimit,offset } = getPagination({ page,limit });
  const appConstants = await getAppConfig();
  const now = moment().toDate();
  const lastDay = moment().add(appConstants.CLEARANCE_TIME_LIMIT_DAYS,"days").toDate();
    const products = await commonfunctions.findAll('product', {
    condition: {
      deletedAt: null,
      expiryDate: {
        [Op.between]: [ now, lastDay ],
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
        where : { status: 'active' },
        required: false, 
        attributes: ['id', 'priority'],
        include: {
          model: db.offer,
          as: 'offer',
          where : { status: 'active' },
          required: false, 
          attributes: ['name', 'type', 'discountType', 'discountValue', 'status'],
        },
      },
    ],
    order: [['expiryDate', 'DESC']],
    limit: pageLimit,
    offset,
  });
  const productIds = products.rows.map((data) => data.id);
  const wishListOptions = {};
  wishListOptions['condition'] = { productId: { [Op.in]: productIds }, customerId };
  const wishList = await commonfunctions.findAll('wishList', wishListOptions);
  const wishListArr = wishList.rows.map((data) => data.productId);

  const result = {
    products: formattedProductResponse(products, wishListArr),
    title: appConstants.CLEARANCE_PRICE_TITLE,
  };
  
  return handleSuccess('Fetch Clearance Offers successfully', [result]);
  
};