/* eslint-disable max-len */
const { Op } = require('sequelize');
const moment = require('moment');
const { InternalServerError, NoDataFoundError, ValidationError } = require('../../utils/customError');
const handleSuccess = require('../../utils/successHandler');
const commonFunctions = require('../../utils/commonFunctions');
const db = require('../models');
const { getPagination } = require('../../utils/pagination');
const { formattedCampaignProducts } = require('../../utils/helperFunctions/formattedProduct');
const { sequelize } = db;

exports.createCampaign = async(campaignData, fileId) => {
  if(!fileId){
    throw new ValidationError('Please provide images of campaign')
  }
  campaignData.startDate = moment.utc(campaignData.startDate, 'DD-MM-YYYY').toDate();
  campaignData.endDate = moment.utc(campaignData.endDate, 'DD-MM-YYYY').toDate();
  campaignData.imageId = fileId;

  const createCampaign = await commonFunctions.create('campaign', campaignData);
  if(!createCampaign) {
    throw new InternalServerError("Internal server error");
  } 

  return handleSuccess('Campaign Added', createCampaign);
};

exports.fetchCampaignList = async(query, vendorId) => {
  let page = Number(query.page) || 1;
  let limit = Number(query.limit) || 10;
  const offset = (page - 1) * limit;
  const search = query.search || '';
  const options = {};

  options.condition = { 
    ...(search && {
      [Op.or] : [
        { name : { [Op.iLike]: `%${search}%` } },
      ],
    }),
    ...(vendorId ? { vendorId }: {})
  };
  options.include = [
    {
      model: db.campaignOffer,
      as: 'campaignOffers',
      attributes: ['id'],
      include: [
        {
          model: db.offer,
          as: 'offer',
          attributes: ['name', 'type', 'discountType', 'discountValue', 'status'],
        }
      ],
    },
    {
      model: db.fileUpload,
      as: 'imageDetails',
      attributes: ['id', 'path'],
    }
  ];
  options.attributes = {
    exclude: ['createdAt', 'updatedAt', 'deletedAt']
  }
  options.offset = offset;
  options.limit = limit;
  options.distinct = true;

  const campaignList = await commonFunctions.findAll('campaign', options);

  if(campaignList.length === 0) {
    throw new NoDataFoundError('No Campaigns Found');
  } 
  return handleSuccess('Campaigns Fetched Successfully', campaignList);
};

exports.fetchCampaign = async(id, vendorId) => {
  const options = {};
  options.condition = { 
    id, 
    ...(vendorId ? { vendorId } : {} )
  };
  options.include = [
    {
      model: db.campaignOffer,
      as: 'campaignOffers',
      attributes: ['id'],
      include: [
        {
          model: db.offer,
          as: 'offer',
          attributes: ['name', 'type', 'discountType', 'discountValue', 'status'],
        }
      ],
    },
    {
      model: db.fileUpload,
      as: 'imageDetails',
      attributes: ['id', 'path'],
    }
  ];

  options.attributes = {
    exclude: ['createdAt', 'updatedAt', 'deletedAt'],
  }

  const campaignExist = await commonFunctions.findOne('campaign', options);
  if (!campaignExist) {
    throw new NoDataFoundError(`No campaign found with id ${id}`);
  } 
  return handleSuccess('Campaign Fetched Successfully', campaignExist);
};

exports.updateCampaign = async(id, updateData, vendorData, fileId) => {
  if(fileId){
    updateData.imageId = fileId // in case of image replace of campaign
  }
  const options = {};
  options.condition = {
    id,
    status: 'approved',
    ...( vendorData ? { vendorId: vendorData.vendorId } : {} )
  }
  const campaignExist = await commonFunctions.findOne('campaign', options);
  if(!campaignExist){
    throw new ValidationError(`No active campaign found with id ${id}`);
  }
  if(updateData.startDate){
    updateData.startDate = moment.utc(updateData.startDate, 'DD-MM-YYYY').toDate();
  }
  if(updateData.endDate){
    updateData.endDate = moment.utc(updateData.endDate, 'DD-MM-YYYY').toDate();
  }

  const updateCampaign = await commonFunctions.update('campaign', { id }, updateData);
  if (updateCampaign[0] !== 1) {
    throw new InternalServerError("Internal server error");
  }
 
  return handleSuccess('Campaign Updated Successfully', updateCampaign);
};

exports.discardCampaign = async(id) => {
  const result = await commonFunctions.destroy('campaign', { id });
  if(!result) {
    throw new InternalServerError("Internal server error");
  } 
  return handleSuccess('Campaign Deleted Successfully', result);
};

exports.alterCampaignStatus = async(id, updateData) => {
  const updatedStatus = await commonFunctions.update('campaign', { id }, updateData);
  if(updatedStatus[0] !== 1) {
    throw new InternalServerError('Internal server error');
  } 
  return handleSuccess('Campaign Updated Successfully', updatedStatus);
};

exports.fetchCampaignMobile = async(query) => {
  let page = Number(query.page) || 1;
  let limit = Number(query.limit) || 10;
  const offset = (page - 1) * limit;
  const search = query.search || '';
  const options = {};
  options.include = [
    {
      model: db.campaignOffer,
      as: 'campaignOffers',
      attributes: ['id'],
      include: [
        {
          model: db.offer,
          as: 'offer',
          attributes: ['name', 'type', 'discountType', 'discountValue', 'status'],
        }
      ],
    },
    {
      model: db.fileUpload,
      as: 'imageDetails',
      attributes: [],
    }
  ];
  options.attributes = {
    exclude: ['createdAt', 'updatedAt', 'deletedAt'],
    include: [
      [sequelize.col('imageDetails.path'), 'imagePath']
    ],
  }
  options.offset = offset;
  options.limit = limit;
  options.subQuery = false;

  const campaignList = await commonFunctions.findAll('campaign', options);

  if(campaignList.length === 0) {
    throw new NoDataFoundError('No Campaigns Found');
  } 

  return handleSuccess('Campaigns Fetched Successfully', campaignList);
}

exports.fetchCampaignMobileById = async(id, customerId, query) => {
  const options = {};
  const { pageLimit , offset } = getPagination({ page: query.page, limit: query.limit });
  // options.condition = { 
  //   id, status: 'approved'
  // };
  // options.include = [
  //   {
  //     model: db.campaignOffer,
  //     as: 'campaignOffers',
  //     attributes: ['id'],
  //     include: [
  //       {
  //         model: db.offer,
  //         as: 'offer',
  //         attributes: ['name', 'type', 'discountType', 'discountValue', 'status'],
  //         where: { status: 'active' },
  //         include: [
  //           {
  //             model: db.offerProduct,
  //             as: 'offerProducts',
  //             where: { status: 'active' },
  //             include: [
  //               {
  //                 model: db.product,
  //                 as: 'product',
  //                 include: [
  //                   {
  //                 model: db.productImage,
  //                 as: 'images',
  //                 attributes: ['id'],
  //                 include: 
  //                   {
  //                     model: db.fileUpload,
  //                     as: 'imageDetails',
  //                     attributes: ['id','path'],
  //                   },
  //                   },
  //                   {
  //                     model: db.wishList,
  //                     as: 'wishList',
  //                     where: { customerId },
  //                     required: false,
  //                   },
  //                 ]
  //               }
  //             ]
  //           }
  //         ]
  //       },
  //     ],
  //   },
  // ];

  // options.attributes = {
  //   exclude: ['createdAt', 'updatedAt', 'deletedAt'],
  // }

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
      model: db.wishList,
      as: 'wishList',
      where : { customerId },
      required: false,
    },
    {
      model: db.offerProduct,
      as: 'offerProducts',
      where: {
        status: 'active',
      },
      include: [
        {
          model: db.offer,
          as: 'offer',
            where: {
            status: 'active',
         },
          include:[
            {
              model: db.campaignOffer,
              as: 'campaignProducts',
              include:[
                {
                  model: db.campaign,
                  as: 'campaign',
                  where: { id },
                }
              ]
            }
          ]
        }
      ]
    }
  ];

  options.offset = offset;
  options.limit = pageLimit;
  options.subQuery = false;


  const result = await commonFunctions.findAll('product', options);
  const formattedProducts = formattedCampaignProducts(result.rows);



//   const campaignExist = await commonFunctions.findOne('campaign', options);
//   if (!campaignExist) {
//     throw new NoDataFoundError(`No campaign found with id ${id}`);
//   } 
//  const formattedResponse = await Promise.all(
//   (campaignExist.campaignOffers || []).flatMap(campaignOffer =>
//     Promise.all(
//       (campaignOffer?.offer?.offerProducts || []).map(async offerProduct => {
//         const productImage = await commonFunctions.findOne('product', {
//           condition: { id: offerProduct?.product?.id },
//           include: [
//             {
//               model: db.productImage,
//               as: 'images',
//               include: [
//                 {
//                   model: db.fileUpload,
//                   as: 'imageDetails',
//                 },
//               ],
//             },
//           ],
//         });

//         return {
//           id: offerProduct?.product?.id || "",
//           brand: offerProduct?.product?.brand || "",
//           name: offerProduct?.product?.name || "",
//           description: offerProduct?.product?.description || "",
//           price: offerProduct?.product?.price || 0,
//           expiryDate: offerProduct?.product?.expiryDate,
//           quantity: offerProduct?.product?.quantity,
//           unit: offerProduct?.product?.unit,
//           weight: offerProduct?.product?.weight,
//           image: productImage?.images?.[0]?.imageDetails?.path || null,
//           offerValue: campaignOffer?.offer?.discountValue || null,
//           offerType: campaignOffer?.offer?.discountType || null,
//           totalDiscount:
//             campaignOffer?.offer?.discountType === "percentage"
//               ? (offerProduct?.product?.price * 100) / campaignOffer?.offer?.discountValue
//               : campaignOffer?.offer?.discountValue || 0,
//           subCategoryId: offerProduct?.product?.subCategoryId,
//           isPrescriptionRequired: offerProduct?.product?.isPrescriptionRequired || false,
//           isWishListed: !!offerProduct?.product?.wishList?.id,
//         };
//       })
//     )
//   )
// );

  const finalResult = {
      page: query.page,
      limit: pageLimit,
      totalResponses: result.count,
      totalPages: Math.ceil(result.count / pageLimit),
      responses: formattedProducts
    };


  return handleSuccess('Campaign Fetched Successfully', finalResult);
};