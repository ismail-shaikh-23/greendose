/* eslint-disable max-len */
const commonFunctions = require('../../utils/commonFunctions');
const { InternalServerError, NoDataFoundError } = require('../../utils/customError');
const { getPagination } = require('../../utils/pagination');
const handleSuccess = require('../../utils/successHandler');

exports.createFaq = async(body) => {
  const result = await commonFunctions.create('faq', body);
  if(!result){
    throw new InternalServerError('Internal server error');
  }
  return handleSuccess('Created FAQ Successfully', result);
};

exports.updateFaq = async(body, id) => {
  const result = await commonFunctions.update('faq', { id }, body, true);
  if(result[0] !== 1){
    throw new InternalServerError('Internal server error');
  }
  return handleSuccess('Modified the FAQ successfully', result[1][0]);
};

exports.getAllFaq = async(query) => {
  const { page = 1 ,limit = 10 } = query; 
  const { pageLimit, offset } = getPagination({ page,limit });
  const options = {};
  options['limit'] = pageLimit;
  options['offset'] = offset;
  const result = await commonFunctions.findAll('faq',options);
  if(result.rows.length === 0){
    throw new NoDataFoundError('No FAQs Found');
  };
  const finalResult = {
    page,
    limit,
    totalResponses: result.count,
    totalPages: Math.ceil(result.count / limit),
    responses: result.rows,
  };
  return handleSuccess('Fetched all the FAQs Successfully', finalResult);

};

exports.getFaqById = async(id) => {
  const result = await commonFunctions.findOne('faq',{ condition: { id } });
  if(!result){
    throw new NoDataFoundError('No FAQ Found');
  }
  return handleSuccess('FAQ Fetched Successfully', result);
};

exports.deleteFaqById = async(id) => {
  const result = await commonFunctions.destroy('faq', { id } );
  if(!result){
    throw new InternalServerError('Internal server error');
  }
  return handleSuccess('Deleted FAQ Successfully', result);
};