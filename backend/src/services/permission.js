 
/* eslint-disable max-len */
const { NoDataFoundError, BadRequestError, ValidationError, InternalServerError } = require('../../utils/customError'); 
const handleSuccess = require('../../utils/successHandler'); 
const commonFunctions = require('../../utils/commonFunctions');
const { Op } = require('sequelize');

exports.createPermission = async(permissionData) => { 
  const addedPermission = await commonFunctions.create('permission', permissionData);
  if (!addedPermission) { 
    throw new InternalServerError('Internal server error');
  } 
  
  return handleSuccess('Permission created'); 
}; 

exports.fetchPermissionDetails = async(query) => { 
  const { fetchAll } = query;
  let page = Number(query.page) || 1;
  let limit = Number(query.limit) || 10;
  const offset = (page - 1) * limit;
  const search = query.search || '';
  const options = {};
  
  options.condition = { 
    ...(search && {
      [Op.or] : [
        { actionName : { [Op.iLike]: `%${search}%` } },
        { description : { [Op.iLike]: `%${search}%` } },
        { method : { [Op.iLike]: `%${search}%` } },
      ],
    }),
  };
  options.offset = offset;
  options.limit = limit;
  options.attributes = ['id', 'actionName', 'description', 'baseUrl', 'path', 'method', 'createdAt', 'updatedAt'];

  if(fetchAll === 'true') {
    delete options.limit;
    delete options.offset;
    options.attributes = ['id', 'actionName', 'description'];
  }
  const permissionRecords = await commonFunctions.findAll('permission', options);
  if (permissionRecords.length === 0) { 
    throw new NoDataFoundError();
  } 

  return handleSuccess('Permission found', permissionRecords); 
}; 

exports.fetchPermissionById = async(id) => { 
  if(!id){
    throw new ValidationError('Id is required');
  }
  const permissionRecord = await commonFunctions.findOne('permission',{ condition: { id } });
  if (!permissionRecord) { 
    throw new NoDataFoundError(`No Permission found with Id ${id}`); 
  } 
  return handleSuccess('Permission found', permissionRecord); 
}; 

exports.updatePermissionById = async( id, updateData ) => { 
  const permissionExist = await commonFunctions.findOne('permission', { condition : { id } });
  if (!permissionExist) { 
    throw new NoDataFoundError(`No permission found with Id ${id}`); 
  } 
  const updateRecord = await commonFunctions.update('permission', { id }, updateData);
  if (updateRecord[0] !== 1) { 
    throw new InternalServerError('Internal server error');
  } 
  return handleSuccess('Permission updated'); 
}; 

exports.deletePermissionById = async(id) => { 
  if(!id){
    throw new ValidationError('Id is required');
  }
  const removedPermission = await commonFunctions.destroy('permission', { id });  
  if (!removedPermission) { 
    throw new NoDataFoundError(`No Permission found with Id ${id}`); 
  }  
  return handleSuccess('Permission deleted'); 
}; 
