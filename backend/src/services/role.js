 
/* eslint-disable max-len */
const db = require('../models'); 
const { Op } = require('sequelize');
const { NoDataFoundError, BadRequestError, ValidationError, InternalServerError } = require('../../utils/customError'); 
const handleSuccess = require('../../utils/successHandler'); 
const commonFunctions = require('../../utils/commonFunctions');

exports.createRole = async(roleData) => { 
  const roleCreated = await commonFunctions.create('role', roleData);
  if (!roleCreated) { 
    throw new InternalServerError('Internal server error'); 
  } 
  return handleSuccess('Role created');
}; 

exports.fetchRoleDetails = async(query) => { 
  let page = Number(query.page) || 1;
  let limit = Number(query.limit) || 10;
  const offset = (page - 1) * limit;
  const search = query.search || '';
  const options = {};
  
  options.condition = { 
    ...(search && {
      [Op.or] : [
        { name : { [Op.iLike]: `%${search}%` } },
        { description : { [Op.iLike]: `%${search}%` } },
      ],
    }),
  };
  options.offset = offset;
  options.limit = limit;

  const roleRecords = await commonFunctions.findAll('role', options);
  if (roleRecords.length === 0) { 
    throw new NoDataFoundError(); 
  } 
  return handleSuccess('Role fetched successfully', roleRecords); 
}; 

exports.fetchRoleById = async(id) => { 
  if(!id){
    throw new ValidationError('Id is required');
  }
  const options = {};
  options.condition = { id: id, deletedAt: null };
  options.include = [{ model: db.permission, through: { attributes: [] } }];

  const roleDetails = await await commonFunctions.findOne('role', options);
  if (!roleDetails) { 
    throw new NoDataFoundError(`No role found with Id ${id}`); 
  } 
  return handleSuccess('Role found', roleDetails);
}; 

exports.updateRoleById = async(id, updateBody) => { 
  const roleFound = await commonFunctions.findOne('role', { id });
  if (!roleFound) { 
    throw new NoDataFoundError(`No Role found with Id ${id}`); 
  } 

  const updateRole = await commonFunctions.update('role', { id }, updateBody); 
  if (updateRole[0] !== 1) { 
    throw new InternalServerError('Internal server error'); 
  } 
  return handleSuccess('Role updated');
}; 

exports.deleteRoleById = async(id) => { 
  if(!id){
    throw new ValidationError('Id is required');
  }
  const removedRole = await commonFunctions.destroy('role', { id });
  if (!removedRole) { 
    throw new NoDataFoundError(`No Role found with Id ${id}`); 
  } 
  return handleSuccess('Role deleted');
}; 
