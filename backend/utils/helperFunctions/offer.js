/* eslint-disable max-len */
/* eslint-disable no-return-await */
const db = require('../../src/models');
const {
  BadRequestError,
  NoDataFoundError,
} = require('../customError');
const commonfunctions = require('../commonFunctions');
const { Op } = require('sequelize');
const { offer } = require('../constant');
const moment = require('moment');
const _ = require('lodash');
const { sequelize } = require('../../src/models');

async function validateOffer(data, isBulk = false) {
  const items = Array.isArray(data) ? data : [data];
  const offerDetails = [];

  for (const item of items) {
    const row = await commonfunctions.findOne('offer', {
      condition: {
        id: item,
        status: offer.INAPP_STATUS.ACTIVE,
        approvalStatus: offer.APPROVAL_STATUS.APPROVED,
        endDate: { [Op.gte]: moment().endOf('day').toDate() },
      },
      attributes: ['id', 'discountType', 'type', 'discountValue', 'name'],
    });
    if(row) offerDetails.push(row);
  }
  return isBulk ? offerDetails : (offerDetails[0] || null);
};

async function validateProduct(data, isBulk = false) {
  const items = Array.isArray(data) ? data : [data];
  const productDetails = [];

  for (const item of items) {
    const row = await commonfunctions.findOne('product', {
      condition: { id: item },
      attributes: ['id', 'price'],
    });
    if(row) productDetails.push(row);
  }

  return isBulk ? productDetails : (productDetails[0] || null);
};

exports.processOfferProductMappings = async(
  { offerIds, productIds, offerMap, productMap, existingMap, isBulk },
  transaction,
) => {
  const createdList = [];

  for (const oid of offerIds) {
    const offerData = offerMap.get(oid);
    if (!offerData) continue;

    for (const pid of productIds) {
      const productData = productMap.get(pid);
      if (!productData) continue;

      const key = `${oid}_${pid}`;
      const existing = existingMap.get(key);

      if (existing) {
        if (existing.status !== offer.INAPP_STATUS.ACTIVE) {
          await commonfunctions.update(
            'offerProduct',
            { offerId: oid, productId: pid },
            { status: offer.INAPP_STATUS.ACTIVE },
            transaction,
          );
        }
        continue;
      }

      const created = await commonfunctions.create(
        'offerProduct',
        { offerId: oid, productId: pid, status: offer.INAPP_STATUS.ACTIVE },
        false,
        transaction,
      );
      if (created) createdList.push({ offerId: oid, productId: pid });
    }
  }

  if (!createdList.length) {
    const msg = isBulk
      ? 'No new offer-product pairs were applied.'
      : 'Offer-product pair is invalid or already active.';
    throw new BadRequestError(msg);
  }

  return createdList;
};

exports.generateMappings = async(offerIds, productIds, isBulk) => {
  const offerList = await validateOffer(offerIds, isBulk);
  const productList = await validateProduct(productIds, isBulk);

  const offerMap = new Map(offerList.map(o => [o.id, o]));
  const productMap = new Map(productList.map(p => [p.id, p]));

  const validOfferIds = Array.from(offerMap.keys());
  const validProductIds = Array.from(productMap.keys());

  const comb = validOfferIds.flatMap(
    oid => validProductIds.map(pid => ({ offerId: oid, productId: pid })));

  const existing = [];
  for (const batch of _.chunk(comb, 100)) {
    const recs = await db.offerProduct.findAll({ 
      where: { 
        [Op.or]: batch,
      }, 
      raw: true, 
    });
    existing.push(...recs);
  }

  const existingMap = new Map(
    existing.map(r => [`${r.offerId}_${r.productId}`, r]),
  );

  return { offerMap, productMap, existingMap, validOfferIds, validProductIds };
};

exports.applyNewOffer = async(offerIds, productIds, isBulk) => {
  const { 
    offerMap, 
    productMap, 
    existingMap, 
    validOfferIds, 
    validProductIds } = await this.generateMappings(offerIds, productIds);
  const created = await sequelize.transaction(t =>
    this.processOfferProductMappings({ 
      offerIds: validOfferIds, 
      productIds: validProductIds, 
      offerMap, productMap, 
      existingMap, 
      isBulk,
    }, 
    t,
    ),
  );
  return created;
};

exports.calculateCartDiscount = (offer, cartTotal) => {
  if (cartTotal < offer.minCartAmount) return 0;

  let discount = 0;

  if (offer.discountType === 'PERCENTAGE') {
    discount = (offer.discountValue / 100) * cartTotal;
  } else if (offer.discountType === 'FLAT') {
    discount = offer.discountValue;
  }

  if (offer.maxCartDiscount !== null) {
    discount = Math.min(discount, offer.maxCartDiscount);
  }

  return discount;
};

exports.slabCreations = async(offerId, slabs) => {
  if (!Array.isArray(slabs) || slabs.length === 0) return;
  const slabRecords = slabs.map(slab => ({
    offerId: offerId,
    minPrice: slab.minPrice,
    maxPrice: slab.maxPrice,
    minDiscount: slab.minDiscount,
    maxDiscount: slab.maxDiscount,
    description: `Maximum discount (upto AED ${slab.maxDiscount}) 
    for product price over AED ${slab.minPrice}`,
  }));

  await db.offerSlab.bulkCreate(slabRecords);
};

exports.updateOfferPriority = async(body) => {
  const offerList = await validateOffer(body.offerId, true);
  if(!offerList) throw new NoDataFoundError('Offer not found');
  const productList = await validateProduct(body.productId, true);
  if(!productList) throw new NoDataFoundError('Product not found');

  return await db.sequelize.transaction(async(t) => {
    const currentOffer = await db.offerProduct.findOne({ where: { offerId: body.offerId, productId: body.productId } }, { transaction: t });

    if (!currentOffer) throw new NoDataFoundError('Offer not found');

    const existingOffer = await db.offerProduct.findOne({
      where: {
        priority: body.newPriority,
        offerId: { [Op.ne]: body.offerId },
        productId: { [Op.ne]: body.productId },
      },
      transaction: t,
    });

    if (existingOffer) {
      existingOffer.priority = currentOffer.priority;
      await existingOffer.save({ transaction: t });
    }

    currentOffer.priority = body.newPriority;
    await currentOffer.save({ transaction: t });

    return 'Priority updated successfully';
  });
};
