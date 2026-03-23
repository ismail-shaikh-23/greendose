/* eslint-disable max-len */
const response = require('../../utils/response');
const { createOffer, fetchOfferList, fetchOfferById, updateOfferById, deleteOfferById, updateOfferStatusById, fetchClearanceOffers } = require('../services/offer');

exports.createOffer = async(req, res) => {
  const userId = req.userData.id;
  const fileIds = req.uploadedFiles || [];
  let body = req.body;
  body.fileIds = fileIds;
  const result = await createOffer(userId, body, req.vendor);
  return response.ok(res, result);
};

exports.getOffers = async(req, res) => {
  const result = await fetchOfferList(req.query, req.vendor);
  return response.ok(res, result);
};

exports.getOfferById = async(req, res ) => {
  const { id } = req.params;
  const result = await fetchOfferById(id);
  return response.ok(res, result);
};

exports.updateOffer = async(req, res ) => {
  const { id } = req.params;
  const userId = req.userData.id;
  const fileIds = req.uploadedFiles || [];
  let body = req.body;
  body.fileIds = fileIds;
  const result = await updateOfferById(id, userId, body, req.vendor);
  return response.ok(res, result);
};

exports.updateOfferStatus = async(req, res ) => {
  const { id } = req.params;
  const userId = req.userData.id;
  const result = await updateOfferStatusById(id, userId, req.body);
  return response.ok(res, result);
};

exports.deleteOffer = async(req, res ) => {
  const { id } = req.params;
  const result = await deleteOfferById(id);
  return response.ok(res, result);
};

exports.fetchClearanceOffers = async (req, res) => {
  const result = await fetchClearanceOffers( req.query.page, req.query.limit, req.userData.id );
  return response.ok(res, result);
};