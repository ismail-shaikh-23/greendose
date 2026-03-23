/* eslint-disable max-len */
const response = require('../../utils/response'); 
const { insertBrowsingHistory, fetchBrowsingHistory, removeBrowsingHistory } = require('../services/browsingHistory');

exports.insertBrowsingHistory = async(req, res) => {
  const customerId = req.userData.id;
  const result = await insertBrowsingHistory(customerId,req.params.productId); 
  return response.created(res, result); 
}; 

exports.fetchBrowsingHistory = async(req, res) => {
    const customerId = req.userData.id;
    const result = await fetchBrowsingHistory(customerId,req.query);
    return response.ok(res, result);
};

exports.removeBrowsingHistory = async(req, res) => {
     const { id } = req.params; 
      const result = await removeBrowsingHistory(id); 
      return response.ok(res, result); 
};