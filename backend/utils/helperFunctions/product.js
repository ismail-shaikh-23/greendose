const { role } = require('../constant');
const commonfunctions = require('../../utils/commonFunctions');

exports.fetchAllRelatedDiscounts = (product, {
  filterPriority = null,
  isList = false,
} = {}) => {
  const price = product.price;
  const offerProducts = product.offerProducts || [];

  const applicableOffers = offerProducts
    .filter(({ offer, priority }) => {
      if (!offer || offer.status !== 'active') return false;
      if (filterPriority !== null && priority !== filterPriority) return false;
      return true;
    })
    .map(({ offer, priority, offerId, productId }) => ({
      price,
      offerId,
      productId,
      offerName: offer.name,
      discountType: offer.discountType,
      discountValue: offer.discountValue,
      priority,
      offerText: offer.discountType === 'percentage'
        ? `Up to ${offer.discountValue}% OFF`
        : `Up to AED ${offer.discountValue} OFF`,
    }));

  return isList
    ? applicableOffers.filter((item) => item.priority === 1)
    : applicableOffers;
};

exports.isAdmin = async(userId) => {
  const userDetails = await commonfunctions.findOne('user', 
    { 
      condition: { id: userId },
    },
  );
  
  return userDetails.roleId === role.ADMIN ? true : false;
};