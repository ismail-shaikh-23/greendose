/* eslint-disable no-console */ 
/* eslint-disable max-len */ 
const db = require('../models'); 
const response = require('../../utils/response');

module.exports = async(req, res, next) => { 
  const roleId = req.userData.role;
  const userPermission = await db.permission.findOne({
      where : {
          baseUrl : req.baseUrl,
          path : req.route.path,
          method : req.method,
      }
  });
  if(!userPermission){
      return response.unauthorized(res, { message: "Permission not found"});
  }

  const rolerPermission = await db.rolePermission.findOne({
      where: {
          roleId,
          permissionId: userPermission.id
      }
  });
  if(!rolerPermission){
      return response.forbidden(res, { message: "You don't have permission to access this"})
  }
  next();
}; 
