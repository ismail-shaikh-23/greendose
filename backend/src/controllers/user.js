/* eslint-disable max-len */
const {
  createUser,
  fetchUserDetails,
  fetchUserById,
  updateUserById,
  deleteUserById,
} = require('../services/user'); 
const response = require('../../utils/response'); 

exports.insertUser = async(req, res) => { 
  const { firstName, lastName, password, userName, email, mobileNumber, roleId, vendorId } = req.body; 
  const result = await createUser({ firstName, lastName, password, userName, email, mobileNumber, roleId, vendorId }); 
  return response.created(res, result); 
}; 

exports.retrieveUser = async(req, res) => { 
  const result = await fetchUserDetails(req.query); 
  return response.ok(res, result); 
}; 

exports.retrieveUserById = async(req, res) => { 
  const { id } = req.params;
  const result = await fetchUserById(id); 
  return response.ok(res, result); 
}; 

exports.modifyUser = async(req, res) => { 
  const { id } = req.params; 
  const updateBody = req.body;
  const result = await updateUserById(id, updateBody); 
  return response.ok(res, result); 
}; 

exports.removeUser = async(req, res) => { 
  const { id } = req.params; 
  const result = await deleteUserById(id); 
  return response.ok(res, result); 
}; 
