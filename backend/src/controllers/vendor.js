/* eslint-disable max-len */
const { 
  createVendor, 
  fetchVendorDetails, 
  fetchVendorById, 
  updateVendorById, 
  deleteVendorById, 
  updateVendorStatusById,
  registerVendor,
  sendEmailToUnregisteredVendor
} = require('../services/vendor'); 
const response = require('../../utils/response'); 

exports.insertVendor = async(req, res) => {
  const result = await createVendor(req.body); 
  return response.created(res, result); 
};

exports.registerVendor = async(req, res) => {
  const result = await registerVendor(req.body); 
  return response.created(res, result); 
};

exports.retrieveVendor = async(req, res) => { 
  const result = await fetchVendorDetails(req.query); 
  return response.ok(res, result); 
}; 

exports.retrieveVendorById = async(req, res) => { 
  const { id } = req.params;
  const result = await fetchVendorById(id); 
  return response.ok(res, result); 
}; 

exports.modifyVendor = async(req, res) => { 
  const { id } = req.params; 
  const updateBody = req.body;
  const result = await updateVendorById(id, updateBody); 
  return response.ok(res, result); 
}; 

exports.removeVendor = async(req, res) => { 
  const { id } = req.params; 
  const result = await deleteVendorById(id); 
  return response.ok(res, result); 
}; 

exports.updateStatus = async(req, res) => { 
  const { id } = req.params; 
  const result = await updateVendorStatusById(id, req.body); 
  return response.ok(res, result); 
}; 

exports.sendEmailToUnregisteredVendor = async(req, res) => {
  const { email } = req.body;
  const result = await sendEmailToUnregisteredVendor(email);
  return response.ok(res, result);
} 