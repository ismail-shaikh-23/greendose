const { 
  dashBoardCount,
  fetchTopProducts,
  fetchExpiryAlertProduct,
  yearlySales } = require('../services/dashboardAdmin');
const response = require('../../utils/response');


exports.counts = async(req, res) => {
  const result = await dashBoardCount();
  return response.ok(res, result);
};

exports.topProducts = async(req, res) => {
  const result = await fetchTopProducts();
  return response.ok(res, result);
};

exports.expiryAlertProducts = async(req, res) => {
  const result = await fetchExpiryAlertProduct();
  return response.ok(res, result);
};

exports.salesGraph = async(req, res) => {
  const result = await yearlySales(req.query);
  return response.ok(res, result);
};