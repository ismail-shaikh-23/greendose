/* eslint-disable max-len */
const response = require('../../utils/response');
const { createFaq, updateFaq, getAllFaq, getFaqById, deleteFaqById } = require('../services/faq');

exports.insertFaq = async(req, res) => {
  const result = await createFaq(req.body);
  return response.created(res, result);
};

exports.modifyFaq = async(req, res) => {
  const result = await updateFaq(req.body, req.params.id);
  return response.ok(res, result);
};


exports.fetchAllFaq = async(req, res) => {
  const result = await getAllFaq(req.query);
  return response.ok(res, result);
};

exports.fetchFaqById = async(req, res) => {
  const result = await getFaqById(req.params.id);
  return response.ok(res, result);
};

exports.removeFaqById = async(req, res) => {
  const result = await deleteFaqById(req.params.id);
  return response.ok(res, result);
};