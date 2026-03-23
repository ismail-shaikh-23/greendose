/* eslint-disable max-len */

const response = require('../../utils/response'); 
const {
  createCustomer,
  fetchCustomerDetails,
  fetchCustomerById,
  updateCustomerById,
  deleteCustomerById,
  customerCampaign,
} = require('../services/customer');

exports.insertCustomer = async(req, res) => { 
  const result = await createCustomer(req.body); 
  return response.created(res, result); 
}; 

exports.retrieveCustomer = async(req, res) => { 
  const result = await fetchCustomerDetails(req.query); 
  return response.ok(res, result); 
}; 

exports.retrieveCustomerById = async(req, res) => { 
  const { id } = req.params;
  const result = await fetchCustomerById(id); 
  return response.ok(res, result); 
}; 

exports.modifyCustomer = async(req, res) => { 
  const { id } = req.params; 
  const result = await updateCustomerById(id, req.body); 
  return response.ok(res, result); 
}; 

exports.removeCustomer = async(req, res) => { 
  const { id } = req.params; 
  const result = await deleteCustomerById(id); 
  return response.ok(res, result); 
}; 

exports.customerCampaign = async (req, res) => {
  const result = await customerCampaign();
  return response.ok(res, result);
};