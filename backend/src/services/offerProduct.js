/* eslint-disable max-len */
const db = require('../models');
const {
  BadRequestError,
  ValidationError,
  NoDataFoundError,
} = require('../../utils/customError');
const handleSuccess = require('../../utils/successHandler');
const commonfunctions = require('../../utils/commonFunctions');
const { Op } = require('sequelize');
const { offer } = require('../../utils/constant');
const { sequelize } = require('../models');
const { 
  generateMappings, 
  processOfferProductMappings, 
  applyNewOffer, 
  calculateCartDiscount,
  updateOfferPriority } = require('../../utils/helperFunctions/offer');

exports.createOfferProduct = async(offerData) => {
  const isBulk = Array.isArray(offerData.offerId) || Array.isArray(offerData.productId);
  const offerIds = Array.isArray(offerData.offerId) ? offerData.offerId : [offerData.offerId];
  const productIds = Array.isArray(offerData.productId) ? offerData.productId : [offerData.productId];

  if (offerIds.length * productIds.length > offer.MAX_BATCH_SIZE) {
    throw new BadRequestError('Too many combinations. Please try smaller batches.');
  }

  const { offerMap, productMap, existingMap, validOfferIds, validProductIds } = await generateMappings(offerIds, productIds, isBulk);

  const created = await sequelize.transaction(t =>
    processOfferProductMappings({ offerIds: validOfferIds, productIds: validProductIds, offerMap, productMap, existingMap, isBulk }, t),
  );

  return handleSuccess(
    isBulk ? 'Offers applied successfully to products.' : 'Offer applied successfully to product.',
    created,
  );
};

exports.fetchOfferProductList = async(query) => { 
  const { fetchAll } = query;
  let page = Number(query.page) || 1;
  let limit = Number(query.limit) || 10;
  const offset = (page - 1) * limit;
  const search = query.search || '';
  const options = {};
  
  options.condition = { 
    ...(search && {
      [Op.or] : [
        { name : { [Op.iLike]: `%${search}%` } },
        { discountValue : { [Op.iLike]: `%${search}%` } },
      ],
    }),
  };
  options.offset = offset;
  options.limit = limit;
  options.include = [
    {
      model: db.product,
      as: 'product',
      attributes: {
        exclude: ['id', 'isPrescriptionRequired', 'vendorId'],
      },
    },
    {
      model: db.offer,
      as: 'offer',
      attributes: ['name', 'type', 'discountValue', 'status'],
    },
  ];
  options.raw = true;
  if(fetchAll === 'true') {
    delete options.limit;
    delete options.offset;
  }
  const OfferProductRecords = await commonfunctions.findAll(
    db.offerProduct, 
    options,
  );
  if (OfferProductRecords.length === 0) { 
    throw new NoDataFoundError('No offer found for the products.');
  } 

  return handleSuccess('OfferProduct found', OfferProductRecords); 
}; 

exports.fetchOfferProductById = async(id) => { 
  const options = {};
  if(!id){
    throw new ValidationError('Id is required');
  }
  options.condition = { id },
  options.include = [
    {
      model: db.product,
      as: 'product',
      attributes: {
        exclude: ['id', 'isPrescriptionRequired', 'vendorId'],
      },
    },
    {
      model: db.offer,
      as: 'offer',
      attributes: ['name', 'type', 'discountValue', 'status'],
    },
  ];
  const OfferProductRecord = await commonfunctions.findOne(
    db.offerProduct,
    options,
  );
  if (!OfferProductRecord) { 
    throw new NoDataFoundError(`No OfferProduct found with Id ${id}`); 
  } 
  return handleSuccess('OfferProduct found', OfferProductRecord); 
}; 

exports.updateOfferProductById = async(updateData) => {
  if (updateData.remove && Object.keys(updateData.remove).length) {
    let { offerId, productId } = updateData.remove;
    if (!offerId || !productId) {
      throw new BadRequestError('offerId and productId are required in remove object');
    }
    const productIds = Array.isArray(productId) ? productId : [productId];

    await db.offerProduct.destroy({
      where: {
        productId: { [Op.in]: productIds },
        offerId: offerId,
      },
    });
  }

  if (updateData.apply && Object.keys(updateData.apply).length) {
    let { offerId, productId } = updateData.apply;
    if (!offerId || !productId) {
      throw new BadRequestError('offerId and productId are required in apply object');
    }
    const productIds = Array.isArray(productId) ? productId : [productId];
    const isBulk = productIds.length > 1;

    const newOffer = await applyNewOffer(offerId, productIds, isBulk);
    const message = isBulk ? 'Offer applied successfully to products.' : 'Offer applied successfully to product.';
    return handleSuccess(message, newOffer);
  }

  return handleSuccess ({ message: 'Nothing to apply or remove' });
};

exports.deleteOfferProductById = async(id) => { 
  if(!id){
    throw new ValidationError('Id is required');
  }
  const removedOfferProduct = await commonfunctions.destroy(
    db.offerProduct, 
    { id },
  );
  if (!removedOfferProduct) { 
    throw new NoDataFoundError(`No OfferProduct found with Id ${id}`); 
  }  
  return handleSuccess('OfferProduct deleted'); 
}; 

exports.getCartDiscount = async(data) => {
  const offer = await db.offer.findOne({
    where: {
      id: data.offerId,
    },
  });

  let bestOffer = null;
  let maxDiscount = 0;
  const discount = calculateCartDiscount(offer, data.cartTotal);
  if (discount > maxDiscount) {
    maxDiscount = discount;
    bestOffer = offer;
  }
  const finalAmount = data.cartTotal - maxDiscount;

  return handleSuccess('OfferProduct deleted', {
    actualCartPrice: data.cartTotal,
    discountedCartPrice: finalAmount,
    discount: maxDiscount,
    appliedOffer: bestOffer,
  }); 
};

exports.updatePriority = async(body) => {
  const priority = await updateOfferPriority(body);
  return handleSuccess(priority); 
};

