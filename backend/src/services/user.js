 
/* eslint-disable max-len */
const { Op } = require('sequelize');
const { NoDataFoundError, BadRequestError, ValidationError, InternalServerError } = require('../../utils/customError'); 
const handleSuccess = require('../../utils/successHandler'); 
const commonFunctions = require('../../utils/commonFunctions');
const { role } = require('../../utils/constant');

exports.createUser = async(userData) => { 
  const condition = {
    [Op.or]: [
      { email: userData.email },
      { userName: userData.userName },
      { mobileNumber: userData.mobileNumber },
    ],
  };
  const result = await commonFunctions.findOne('user', { condition });
  const options = {};
  let validationField;
  let key;
  if(result){
    if(result.email === userData.email){
      validationField = 'email';
      key = 'email';
    }else if(result.userName === userData.userName){
      validationField = 'username';
      key = 'userName';
    }else if(result.mobileNumber === userData.mobileNumber){
      validationField = 'mobile number';
      key = 'mobileNumber';
    }
    throw new ValidationError(`User with this ${validationField} ${userData[key]} already exist`);
  }

  // check if role exists
  options.condition = { id: userData.roleId };
  const checkRole = await commonFunctions.findOne('role', options);
  if(!checkRole){
    throw new ValidationError(`Role with id ${userData.roleId} not found`);
  }

  // remove vendorId when user type is Admin
  if(checkRole.name == 'admin'){
    delete userData.vendorId;
  }
  else{
    const vendorExist = await commonFunctions.findByPk('vendor', userData.vendorId);
    if(!vendorExist){
      throw new ValidationError(`Vendor with is ${userData.vendorId} not exist`);
    }
  }

  userData.isActive = true;
  const userCreated = await commonFunctions.create('user', userData);
  if (!userCreated) { 
    throw new InternalServerError('Internal server error'); 
  } 
  return handleSuccess('User created');  
}; 

exports.fetchUserDetails = async(query) => { 
  let page = Number(query.page) || 1;
  let limit = Number(query.limit) || 10;
  const offset = (page - 1) * limit;
  const search = query.search || '';
  const options = {};
  
  let roleId;
  if (query.isVendor === 'true') {
    roleId = role.VENDORUSER;
  // } else if (query.isAdmin === 'true') {
  } else {
    roleId = { [Op.ne]: role.VENDORUSER };
  } 

  options.condition = { 
    ...(roleId && { roleId }),
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
  options.attributes = { exclude: ['password'] };
  const userRecords = await commonFunctions.findAll('user', options);
  if (userRecords.length === 0) { 
    throw new NoDataFoundError();
  } 
  return handleSuccess('User found', userRecords); 
}; 

exports.fetchUserById = async(id) => { 
  if(!id){
    throw new ValidationError('Id is required');
  }
  const options = {};
  options.condition = { id: id };
  options.attributes = { exclude: ['password'] };

  const userDetails = await commonFunctions.findOne('user', options); 
  if (!userDetails) { 
    throw new BadRequestError(`No user found with Id ${id}`); 
  } 
  return handleSuccess('User found', userDetails); 
}; 

exports.updateUserById = async( id, updateBody) => { 
  if (!id || !updateBody) {
    throw new BadRequestError('ID and updateBody are required');
  }
  const options = { condition: { id } };
  const userData = await commonFunctions.findOne('user', options);
  if (!userData) {
    throw new NoDataFoundError(`No user found with Id ${id}`);
  }

  const orConditions = [];
  if (updateBody.email) orConditions.push({ email: updateBody.email });
  if (updateBody.userName) orConditions.push({ userName: updateBody.userName });
  if (updateBody.mobileNumber) orConditions.push({ mobileNumber: updateBody.mobileNumber });

  if (orConditions.length > 0) {
    const condition = {
      [Op.and]: [
        { [Op.or]: orConditions },
        { id: { [Op.ne]: id } },
      ],
    };
    const result = await commonFunctions.findOne('user', { condition });
    if (result) {
      let validationField, key;
      if (updateBody.email && result.email === updateBody.email) {
        validationField = 'email';
        key = 'email';
      } else if (updateBody.userName && result.userName === updateBody.userName) {
        validationField = 'username';
        key = 'userName';
      } else if (updateBody.mobileNumber && result.mobileNumber === updateBody.mobileNumber) {
        validationField = 'mobile number';
        key = 'mobileNumber';
      }
      throw new ValidationError(`User with this ${validationField} ${updateBody[key]} already exists`);
    }
  }
  const userUpdate = await commonFunctions.update('user', { id }, updateBody);
  if (userUpdate[0] !== 1) { 
    throw new InternalServerError('Internal server error');  
  } 
  return handleSuccess('User updated successfully');
};

exports.deleteUserById = async(id) => { 
  if(!id){
    throw new ValidationError('Id is required');
  }
  const removedUser = await commonFunctions.destroy('user', { id });
  if (!removedUser) { 
    throw new BadRequestError(`No user found with Id ${id}`); 
  } 
  return handleSuccess('User deleted'); 
}; 
