 
/* eslint-disable max-len */ 
const { 
  NoDataFoundError, 
  BadRequestError, 
  ValidationError,
  InternalServerError
} = require('../../utils/customError'); 
const handleSuccess = require('../../utils/successHandler'); 
const commonFunctions = require('../../utils/commonFunctions');

exports.createRolePermission = async(rolePermissionData) => { 
  const options = {};
  options.condition = {
    roleId: rolePermissionData.roleId,
    permissionId: rolePermissionData.permissionId,
  };

  const checkIfExist = await commonFunctions.findOne('rolePermission', options);
  if(checkIfExist){
    throw new ValidationError(`Role id ${rolePermissionData.roleId} and permission id ${rolePermissionData.permissionId} already exist`);
  } 

  const addRolePermission = await commonFunctions.create('rolePermission', rolePermissionData);
  if (!addRolePermission) { 
    throw new InternalServerError('Internal server error'); 
  } 
  return handleSuccess('Role-Permission created'); 
}; 

exports.fetchRolePermissionDetails = async(query) => { 
  const { fetchAll } = query;
  let page = Number(query.page) || 1;
  let limit = Number(query.limit) || 10;
  const offset = (page - 1) * limit;
  const options = {};
  
  options.offset = offset;
  options.limit = limit;
  if(fetchAll === 'true') {
    delete options.limit;
    delete options.offset;
  }
  const rolePermissionRecord = await commonFunctions.findAll('rolePermission', options);

  if (rolePermissionRecord.length === 0) { 
    throw new NoDataFoundError();
  } 
  return handleSuccess('Role-Permission found', rolePermissionRecord);
}; 

exports.fetchRolePermissionById = async(id) => { 
  if(!id){
    throw new ValidationError('Id is required');
  }
  const options = {};
  options.condition = { id };
  const rolePermissionRecord = await commonFunctions.findOne('rolePermission', options);

  if (!rolePermissionRecord) { 
    throw new NoDataFoundError(`No Role-Permission found with Id ${id}`); 
  } 
  return handleSuccess('Role-Permission found', rolePermissionRecord); 
}; 

exports.updateRolePermissionById = async( id, updateBody) => { 
  const checkIfExist = await commonFunctions.findOne('rolePermission', { id });
  if(!checkIfExist){
    throw new NoDataFoundError(`No Role-Permission found with Id ${id}`); 
  }

  const updateRolePermission = await commonFunctions.update('rolePermission', { id }, updateBody);
  if(updateRolePermission[0] !== 1){
    throw new InternalServerError('Internal server error');
  }
  return handleSuccess('Role-Permission updated'); 
}; 

exports.deleteRolePermissionById = async(id) => { 
  if(!id){
    throw new ValidationError('Id is required');
  }
  const removedRolePermission = await commonFunctions.destroy('rolePermission', { id });
  if (!removedRolePermission) { 
    throw new NoDataFoundError(`No Role-Permission found with Id ${id}`); 
  } 
  return handleSuccess('Role-Permission deleted');
}; 

exports.bulkUpdateRolePermissions = async(body) => {
  const { roleId, permissionIds } = body;
  if (!roleId || !Array.isArray(permissionIds)) {
    return new ValidationError('Invalid input: roleId is required and permissionId must be an array.');
  }
  await commonFunctions.destroy('rolePermission', { roleId }, true);
  const rolePermissionFields = permissionIds.map((data) =>({
    roleId: roleId,
    permissionId: data,
    
  }));
 
  await commonFunctions.create('rolePermission', rolePermissionFields, true);
  return handleSuccess('Role-Permission added');
};