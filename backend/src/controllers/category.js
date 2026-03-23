/* eslint-disable max-len */
const { createCategory, fetchCategoryList, fetchCategory, alterCategory, discardCategory, fetchCategoriesForMobile, categoryCampaign } = require('../services/category');
const response = require('../../utils/response');

exports.addCategory = async(req, res) => {
  const { name } = req.body;
  const categoryImage = req.uploadedFiles;
  const result = await createCategory({ name, categoryImage });
  return response.ok(res, result);
};

exports.getCategories = async(req, res) => {
  const result = await fetchCategoryList(req.query);
  return response.ok(res, result);
};

exports.getCategory = async(req, res ) => {
  const { id } = req.params;
  const result = await fetchCategory({ id });
  return response.ok(res, result);
};

exports.updateCategory = async(req, res ) => {
  const { id } = req.params;
  const { name } = req.body;
  const fileId = req.uploadedFiles;
  const result = await alterCategory(id, name, fileId);
  return response.ok(res, result);
};

exports.deleteCategory = async(req, res ) => {
  const { id } = req.params;
  const result = await discardCategory(id);
  return response.ok(res, result);
};

exports.fetchCategoriesForMobile = async(req, res) => {
  const result = await fetchCategoriesForMobile({ page: req.query.page, limit: req.query.limit, id: req.query.id });
  return response.ok(res, result);
};

exports.categoryCampaign = async(req, res) => {
  const result = await categoryCampaign();
  return response.ok(res, result);
};