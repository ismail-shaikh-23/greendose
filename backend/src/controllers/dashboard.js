const { 
  dashBoard,  
  fixedCategoriesService, 
  popularCategoriesService,
  bestDealsService,
  commonDealsService,
  fetchCampaigns,
} = require('../services/dashboard');
const response = require('../../utils/response');

exports.dashBoard = async(req, res) => {
  const result = await dashBoard(req.query, req.userData, req.userData.id);
  return response.ok(res, result);
};

exports.fixedCategories = async(req, res) => {
  const result = await fixedCategoriesService();
  return response.ok(res, result);
};

exports.popularCategories = async(req, res) => {
  const result = await popularCategoriesService();
  return response.ok(res, result);
};

exports.fetchBestDeals = async(req, res) => {
  const result = await bestDealsService({ page: req.query.page, limit: req.query.limit });
  return response.ok(res, result);
};

exports.fetchCommonDeals = async(req, res) => {
  const result = await commonDealsService();
  return response.ok(res, result);
};

exports.fetchCampaigns = async(req, res) => {
  const result = await fetchCampaigns();
  return response.ok(res, result);
}