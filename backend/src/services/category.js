/* eslint-disable max-lines-per-function */
/* eslint-disable no-undef */
/* eslint-disable max-len */
const db = require('../models');
const { InternalServerError, NoDataFoundError ,ValidationError} = require('../../utils/customError');

const handleSuccess = require('../../utils/successHandler');
const commonFunctions = require('../../utils/commonFunctions');
const { getPagination } = require('../../utils/pagination');
const { Op } = require('sequelize');
const { getAppConfig } = require('../../utils/redisConstants');

exports.createCategory = async(userData) => {
  const { name, categoryImage } = userData;
  if(!categoryImage || categoryImage.length == 0){
    throw new ValidationError('Please provide images of category');
  }
  const createCategory = await commonFunctions.create('category', { name });
  if(!createCategory) {
    throw new InternalServerError('Internal server error');
  } 
  const imageData = [];
  for(let i=0;i<categoryImage.length;i++){
    imageData.push({
      categoryId: createCategory.id,
      imageId: categoryImage[i]
    })
  }

  await commonFunctions.create('categoryImage', imageData, bulk= true);
  return handleSuccess('Category Added', createCategory);
};

exports.fetchCategoryList = async(query) => {
  let page = Number(query.page) || 1;
  let limit = Number(query.limit) || 10;
  let offset = (page - 1) * limit;
  const search = query.search || '';
  const options = {};

  // remove the pagination when allRecords = true
  if(query.allRecords){
    offset = null;
    limit = null;
  }

  options.condition = {
    ...(search && { name : { [Op.iLike]: `%${search}%` } } )
  }
  options.include = [
    { 
      model: db.subCategory, 
      as: 'subCategory',
      attributes: ["id", "name"]
    },
    { 
      model: db.categoryImage, 
      as: 'images',
      attributes: ['id'],
      include: {
        model: db.fileUpload,
        as: 'imageDetails',
        attributes: ['id', 'path'],
      },
    },
  ]
  options.offset = offset;
  options.limit = limit;
  options.distinct = true;

  const categoryRecords = await commonFunctions.findAll('category', options);
  if(categoryRecords.rows.length === 0) {
    throw new NoDataFoundError('No Categories Found');
  } 
  return handleSuccess('Categories Fetched Successfully', categoryRecords);
};

exports.fetchCategory = async(userData) => {
  const { id } = userData;
  const result = await commonFunctions.findOne('category', { 
    condition: { id, deletedAt: null },
    include:  [
      { 
        model: db.subCategory, 
        as: 'subCategory',
      },
      { 
        model: db.categoryImage, 
        as: 'images',
        attributes: ['id'],
        include: {
          model: db.fileUpload,
          as: 'imageDetails',
          attributes: ['id', 'path'],
        },
      },
    ],
  });

  if (!result) {
    throw new NoDataFoundError('No Categories Found');
  } 
  return handleSuccess('Category Fetched Successfully', result);
};

exports.alterCategory = async(id, name, fileId) => {
  if(name){
    const updateName = await commonFunctions.update('category', { id }, { name });
    if(updateName[0] !== 1) {
      throw new InternalServerError('Internal server error');
    } 
  }
  if(fileId){
      const updateImage = await commonFunctions.update('categoryImage', { categoryId: id }, { imageId: fileId });
      if(updateImage[0] !== 1) {
        throw new InternalServerError('Internal server error');
      }
  }
  
  return handleSuccess('Category Updated Successfully');
};

exports.discardCategory = async(id) => {
  const result = await commonFunctions.destroy('category', { id });
  if(!result) {
    throw new InternalServerError('Internal server error');
  } 
  return handleSuccess('Category Deleted Successfully', result);
};

exports.fetchCategoriesForMobile = async(data) => {
  let { page = 1, limit = 10, id } = data;
  if (id) {
    id = parseInt(id);
  }
  const { pageLimit, offset } = getPagination({ page,limit });
  const options = {};

  if (id) {
    options['condition'] = { id };
  }

  options['include'] = [
    {
      model: db.subCategory,
      as: 'subCategory',
      attribute: ['id','name'],
      include: [
        {
          model: db.subCategoryImage,
          as: 'images',
          attribute: ['id'],
          include: [
            {
              model: db.fileUpload,
              as: 'imageDetails',
            },
          ],
        },
      ],
    },
  ];

  if (!id) {
    options['limit'] = pageLimit;
    options['offset'] = offset;
  }
  options['attribute'] = ['id','name'];
  
  const result = await commonFunctions[!id ? 'findAll' : 'findOne']('category', options);
  if ((!id && result.rows.length === 0) || (id && !result)) {
    throw new NoDataFoundError('No Categories Found');
  }
const categoryArray = !id ? result.rows : [result];

const formattedResult = categoryArray.map((category) => {
  const subCategory = category?.subCategory?.map((data) => ({
    id: data.id,
    name: data.name,
    image: data?.images?.[0]?.imageDetails?.path || null,
  }));

  return {
    id: category.id,
    title: category.name,
    subCategory: subCategory,
  };
});

const finalResult = !id ? {
      page,
      limit,
      totalResponses: result.count,
      totalPages: Math.ceil(result.count / limit),
      responses: formattedResult,
    }
  : formattedResult[0];

  return handleSuccess('Successfully Fetched all the categories', finalResult);
};

exports.categoryCampaign = async () => {

  const options = {};
  options['condition'] = { 
    type: 'category',
    status: 'approved' 
  };
  options['include'] = [
    {
      model: db.fileUpload,
      as: 'imageDetails',
    }
  ];
  const result = await commonFunctions.findOne('campaign', options);
  if(!result){
    throw new NoDataFoundError('No Category Campaign Found');
  }
  const formattedResponse = {
    id: result.id,
    image: result?.imageDetails?.path || null
  }
  return handleSuccess('Category Campaign Fetched Successfully', formattedResponse);
}