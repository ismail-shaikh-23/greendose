 
/* eslint-disable max-len */
const { Op } = require('sequelize');
const { NoDataFoundError, BadRequestError, ValidationError, InternalServerError } = require('../../utils/customError'); 
const handleSuccess = require('../../utils/successHandler'); 
const commonFunctions = require('../../utils/commonFunctions');

exports.createAddress = async(customerId, addressData) => { 
  const addressCreated = await commonFunctions.create('address', { customerId, ...addressData });
  if (!addressCreated) { 
    throw new InternalServerError("Internal server error"); 
  } 
  return handleSuccess('Address created', addressCreated);  
}; 

exports.fetchAddressDetails = async(query) => { 
  let page = Number(query.page) || 1;
  let limit = Number(query.limit) || 10;
  const offset = (page - 1) * limit;
  const search = query.search || '';
  const options = {};
  
  options.condition = { 
    ...(search && {
      [Op.or] : [
        { name : { [Op.iLike]: `%${search}%` } },
        { street : { [Op.iLike]: `%${search}%` } },
        { zipCode : { [Op.iLike]: `%${search}%` } },
        { country : { [Op.iLike]: `%${search}%` } },
        { state : { [Op.iLike]: `%${search}%` } },
        { city : { [Op.iLike]: `%${search}%` } },
      ],
    }),
  };
  options.offset = offset;
  options.limit = limit;

  const addressRecords = await commonFunctions.findAll('address', options);
  if (addressRecords.rows.length === 0) { 
    throw new NoDataFoundError();
  } 
  return handleSuccess('Address records fetched successfully', addressRecords); 
}; 

exports.fetchAddressById = async(id) => { 
  if(!id){
    throw new ValidationError('Id is required');
  }
  const options = {};
  options.condition = { id };

  const addressDetails = await commonFunctions.findOne('address', options); 
  if (!addressDetails) { 
    throw new NoDataFoundError(`No address found with Id ${id}`); 
  } 
  return handleSuccess('Address found', addressDetails); 
}; 

exports.fetchAddressByCustomer = async(customerId) => {
  const options = {};
  options.condition = { customerId };

  const addressDetails = await commonFunctions.findAll('address', options);
  if (addressDetails.rows.length === 0) {
    throw new NoDataFoundError('No address found for customer');
  }
  return handleSuccess('Address for customer found', addressDetails);
};

exports.updateAddressById = async( id, updateBody) => { 
  const options = {};
  options.condition = { id: id };
  
  const addressUpdate = await commonFunctions.update('address', { id }, updateBody, true);
  if (addressUpdate[0] !== 1) { 
    throw new BadRequestError(`No address found with Id ${id}`); 
  } 
  return handleSuccess('Address updated successfully', addressUpdate[1][0]);
}; 

exports.deleteAddressById = async(id) => { 
  if(!id){
    throw new ValidationError('Id is required');
  }
  const removedAddress = await commonFunctions.destroy('address', { id });
  if (!removedAddress) { 
    throw new NoDataFoundError(`No address found with Id ${id}`); 
  } 
  return handleSuccess('Address deleted'); 
}; 

exports.updateAddressStatusById = async( id, updateBody) => { 
  const options = {};
  options.condition = { id: id };
  
  const addressUpdate = await commonFunctions.update('address', { id }, updateBody);
  if (addressUpdate[0] !== 1) { 
    throw new BadRequestError(`No address found with Id ${id}`); 
  } 
  return handleSuccess('Address Status updated successfully');
}; 