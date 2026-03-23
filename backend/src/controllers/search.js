/* eslint-disable max-len */
const { relevanceService, globalSearchSevice, randomProducts } = require('../services/search');
const response = require('../../utils/response');

exports.relevance = async(req, res) => {
  const result = await relevanceService(req.query);
  return response.ok(res, result);
};

exports.globalSearch = async(req, res) => {
  const result = await globalSearchSevice(req.query, req.userData?.id);
  return response.ok(res, result);
};

exports.randomProducts = async(req, res) => {
  const result = await randomProducts(req.query.id);
  return response.ok(res, result);
};