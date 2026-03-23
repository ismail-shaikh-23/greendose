 
/* eslint-disable max-len */
const { Op } = require('sequelize');
const { NoDataFoundError, BadRequestError, ValidationError, InternalServerError } = require('../../utils/customError'); 
const handleSuccess = require('../../utils/successHandler'); 
const commonFunctions = require('../../utils/commonFunctions');
const { getAppConfig } = require('../../utils/redisConstants');
const db = require('../models');

exports.createCustomer = async(customerData) => { 
  const condition = {
    [Op.or]: [
      { email: customerData.email },
      { userName: customerData.userName },
      { mobileNumber: customerData.mobileNumber },
    ],
  };
  const result = await commonFunctions.findOne('customer', { condition });
  let validationField;
  let key;
  if(result){
    if(result.email === customerData.email){
      validationField = 'email';
      key = 'email';
    }else if(result.userName === customerData.userName){
      validationField = 'username';
      key = 'userName';
    }else if(result.mobileNumber === customerData.mobileNumber){
      validationField = 'mobile number';
      key = 'mobileNumber';
    }
    throw new ValidationError(`Customer with this ${validationField} ${customerData[key]} already exist`);
  }
  customerData.isActive = true;
  const customerCreated = await commonFunctions.create('customer', customerData);
  if (!customerCreated) { 
    throw new InternalServerError('Internal server error');
  } 

  // also create cart for the customer.
  const cartBody = {
    customerId: customerCreated.id,
  };
  await commonFunctions.create('cart', cartBody);
  return handleSuccess('Customer created');  
}; 

exports.fetchCustomerDetails = async(query) => { 
  let page = Number(query.page) || 1;
  let limit = Number(query.limit) || 10;
  const offset = (page - 1) * limit;
  const search = query.search || '';
  const options = {};
  
  options.condition = { 
    ...(search && {
      [Op.or] : [
        { firstName : { [Op.iLike]: `%${search}%` } },
        { lastName : { [Op.iLike]: `%${search}%` } },
        { email : { [Op.iLike]: `%${search}%` } },
        { userName : { [Op.iLike]: `%${search}%` } },
      ],
    }),
  };
  options.offset = offset;
  options.limit = limit;
  options.attributes = ['id', 'firstName', 'lastName', 'email', 'mobileNumber', 'createdAt', 'updatedAt'];

  const customerRecords = await commonFunctions.findAll('customer', options);
  if (customerRecords.length === 0) { 
    throw new NoDataFoundError();
  } 
  return handleSuccess('Customer found', customerRecords); 
}; 

exports.fetchCustomerById = async(id) => { 
  const options = {};
  options.condition = { id: id };
  options.attributes = ['id', 'firstName', 'lastName', 'email', 'mobileNumber'];

  const customerDetails = await commonFunctions.findOne('customer', options); 
  if (!customerDetails) { 
    throw new NoDataFoundError(`No customer found with Id ${id}`); 
  } 
  return handleSuccess('Customer found', customerDetails); 
}; 

exports.updateCustomerById = async( id, updateBody) => { 
  const options = {};
  options.condition = { id: id };

  const customerData = await commonFunctions.findOne('customer', options);
  if (!customerData) { 
    throw new NoDataFoundError(`No customer found with Id ${id}`); 
  } 
  const orConditions = [];
  if (customerData.email) orConditions.push({ email: customerData.email });
  if (customerData.userName) orConditions.push({ userName: updateBody.userName });
  if (customerData.mobileNumber) orConditions.push({ mobileNumber: customerData.mobileNumber });
  
  if (orConditions.length > 0) {
    const condition = {
      [Op.and]: [
        { [Op.or]: orConditions },
        { id: { [Op.ne]: id } },
      ],
    };

    const result = await commonFunctions.findOne('customer', { condition });
    let validationField;
    let key;
    if(result){
      if(customerData.email && result.email === customerData.email){
        validationField = 'email';
        key = 'email';
      }else if(customerData.userName && result.userName === customerData.userName){
        validationField = 'username';
        key = 'userName';
      }else if(customerData.mobileNumber && result.mobileNumber === customerData.mobileNumber){
        validationField = 'mobile number';
        key = 'mobileNumber';
      }
      throw new ValidationError(`Customer with this ${validationField} ${customerData[key]} already exist`);
    }
  };
  
  const customerUpdate = await commonFunctions.update('customer', { id }, updateBody);
  if (customerUpdate[0] !== 1) { 
    throw new InternalServerError('Internal server error'); 
  } 
  return handleSuccess('Customer updated successfully');
};

exports.deleteCustomerById = async(id) => { 
  if(!id){
    throw new ValidationError('Id is required');
  }
  const removedCustomer = await commonFunctions.destroy('customer', { id });
  if (!removedCustomer) { 
    throw new NoDataFoundError(`No customer found with Id ${id}`); 
  } 
  return handleSuccess('Customer deleted'); 
};

exports.customerCampaign = async () => {

  const options = {};
  options['condition'] = { 
    type: 'profile', 
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
    throw new NoDataFoundError('No Customer Campaign Found');
  }
  const formattedResponse = {
    id: result.id,
    image: result?.imageDetails?.path || null
  }
  return handleSuccess('Customer Campaign Fetched Successfully', formattedResponse);
}