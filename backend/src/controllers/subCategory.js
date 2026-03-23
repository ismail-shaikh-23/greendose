/* eslint-disable max-len */
const { createSubCategory, fetchSubCategoryList, fetchSubCategory, alterSubCategory, discardSubCategory, fetchSubCategoryProducts } = require('../services/subCategory');
const response = require('../../utils/response');

exports.addSubCategory = async(req, res) => {
  const subCategoryImage = req.uploadedFiles;
  const result = await createSubCategory(req.body, subCategoryImage);
  return response.ok(res, result);
};

exports.getSubCategories = async(req, res) => {
  const result = await fetchSubCategoryList(req.query);
  return response.ok(res, result);
};

exports.getSubCategory = async(req, res ) => {
  const { id } = req.params;
  const result = await fetchSubCategory({ id });
  return response.ok(res, result);
};

exports.updateSubCategory = async(req, res ) => {
  const { id } = req.params;
  const fileId = req.uploadedFiles;
  const result = await alterSubCategory(id, req.body, fileId);
  return response.ok(res, result);
};

exports.deleteSubCategory = async(req, res ) => {
  const { id } = req.params;
  const result = await discardSubCategory(id);
  return response.ok(res, result);
};


exports.fetchSubCategoryProducts = async(req, res) => {
  const subCategoryId = +req.params.id; 
  const result = await fetchSubCategoryProducts({ subCategoryId, page: req.query.page, limit: req.query.limit, customerId: req.userData.id, sort: req.query.sort, isMaxSaver : req.query.maxSaver });
  return response.ok(res, result);
};