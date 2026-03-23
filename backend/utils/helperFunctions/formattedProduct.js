exports.formattedProductResponse = (result, productIds = []) => {
  return result.rows.map((data)=> ({
    id: data.id,
    name: data.name,
    price: data.price,
    quantity: data.quantity,
    image: data.images[0]?.imageDetails?.path || null,
    offerValue: data.offerProducts[0] && data.offerProducts[0]?.offer?.discountValue || null,
    offerType: data.offerProducts[0] && data.offerProducts[0]?.offer?.discountType || null,
    // eslint-disable-next-line max-len
    totalDiscount: data.offerProducts[0] && data.offerProducts[0]?.offer?.discountType === 'percentage' ? ( data.price * data.offerProducts[0]?.offer?.discountValue ) / 100 || 1: data.offerProducts[0] && data.offerProducts[0]?.offer?.discountValue || 0,
    isWishListed: productIds.includes(data.id) ? true: false,
    unit: data?.unit || 0,
    weight: data?.weight || '',
    createdAt: data?.createdAt,
    isPrescriptionRequired: data?.isPrescriptionRequired,
  }));
};


exports.formattedRawProductResponse = (result, productIds = []) => {
  return {
    id: result.id,
    name: result.name,
    price: result.price,
    quantity: result.quantity,
    image: result.images[0]?.imageDetails?.path || null,
    offerValue: result.offerProducts[0] && result.offerProducts[0]?.offer?.discountValue || null,
    offerType: result.offerProducts[0] && result.offerProducts[0]?.offer?.discountType || null,
    // eslint-disable-next-line max-len
    totalDiscount: result.offerProducts[0] && result.offerProducts[0]?.offer?.discountType === 'percentage' ? ( result.price * result.offerProducts[0]?.offer?.discountValue ) / 100 || 1: result.offerProducts[0] && result.offerProducts[0]?.offer?.discountValue || 0,
    isWishListed: productIds.includes(result.id) ? true: false,
    unit: result?.unit || 0,
    weight: result?.weight || '',
    isPrescriptionRequired: result?.isPrescriptionRequired || false,
  };
};

exports.displayDashboardProductResponse = (result, productIds = []) => {
  return result.map((data)=> ({
    id: data.id,
    name: data.name,
    price: data.price,
    quantity: data.quantity,
    image: data.images[0]?.imageDetails?.path || null,
    offerValue: data.offerProducts[0] && data.offerProducts[0]?.offer?.discountValue || null,
    offerType: data.offerProducts[0] && data.offerProducts[0]?.offer?.discountType || null,
    // eslint-disable-next-line max-len
    totalDiscount: data.offerProducts[0] && data.offerProducts[0]?.offer?.discountType === 'percentage' ? ( data.price * data.offerProducts[0]?.offer?.discountValue ) / 100 || 1: data.offerProducts[0] && data.offerProducts[0]?.offer?.discountValue || 0,
    isWishListed: productIds.includes(data.id) ? true: false,
    unit: data?.unit || 0,
    weight: data?.weight || '',
  }));
};


exports.formattedProductRowsResponse = (result, productIds = []) => {
  return result.map((data)=> ({
    id: data.id,
    name: data.name,
    price: data.price,
    quantity: data.quantity,
    image: data.images[0]?.imageDetails?.path || null,
    offerValue: data.offerProducts[0] && data.offerProducts[0]?.offer?.discountValue || null,
    offerType: data.offerProducts[0] && data.offerProducts[0]?.offer?.discountType || null,
    // eslint-disable-next-line max-len
    totalDiscount: data.offerProducts[0] && data.offerProducts[0]?.offer?.discountType === 'percentage' ? ( data.price * data.offerProducts[0]?.offer?.discountValue ) / 100 || 1: data.offerProducts[0] && data.offerProducts[0]?.offer?.discountValue || 0,
    isWishListed: productIds.includes(data.id) ? true: false,
    unit: data?.unit || 0,
    weight: data?.weight || '',
    createdAt: data?.createdAt,
    isPrescriptionRequired : data?.isPrescriptionRequired
  }));
};

exports.formattedCampaignProducts = (result) => {
  return result.map((data) => ({
    id: data.id,
    name: data.name,
    price: data.price,
    quantity: data.quantity,
    image: data.images[0]?.imageDetails?.path || null,
    offerValue: data.offerProducts[0] && data.offerProducts[0]?.offer?.discountValue || null,
    offerType: data.offerProducts[0] && data.offerProducts[0]?.offer?.discountType || null,
    // eslint-disable-next-line max-len
    totalDiscount: data.offerProducts[0] && data.offerProducts[0]?.offer?.discountType === 'percentage' ? ( data.price * data.offerProducts[0]?.offer?.discountValue ) / 100 || 1: data.offerProducts[0] && data.offerProducts[0]?.offer?.discountValue || 0,
    isWishListed: data?.wishList?.id ? true : false,
    unit: data?.unit || 0,
    weight: data?.weight || '',
    createdAt: data?.createdAt,
    isPrescriptionRequired : data?.isPrescriptionRequired
  }))
}