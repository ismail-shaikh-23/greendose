/* eslint-disable max-len */
const { 
  createCampaign, 
  fetchCampaignList, 
  fetchCampaign, 
  updateCampaign, 
  discardCampaign, 
  alterCampaignStatus,
  fetchCampaignMobile,
  fetchCampaignMobileById } = require('../services/campaign');
const response = require('../../utils/response');

exports.addCampaign = async(req, res) => {
  const fileId = req.uploadedFiles;
  const body = { ...req.body };
  body.createdBy = req.userData.id;
  if(req.vendor){
    body.isVendor = true;
    body.vendorId = req.vendor.vendorId
  }
  const result = await createCampaign(body, fileId);
  return response.ok(res, result);
};

exports.getCampaigns = async(req, res) => {
  const result = await fetchCampaignList(req.query, req.vendor?.vendorId);
  return response.ok(res, result);
};

exports.getCampaignById = async(req, res ) => {
  const result = await fetchCampaign(req.params.id, req.vendor?.vendorId);
  return response.ok(res, result);
};

exports.updateCampaign = async(req, res ) => {
  const { id } = req.params;
  const fileId = req.uploadedFiles;
  const result = await updateCampaign(id, req.body, req.vendor, fileId);
  return response.ok(res, result);
};

exports.deleteCampaign = async(req, res ) => {
  const { id } = req.params;
  const result = await discardCampaign(id);
  return response.ok(res, result);
};

exports.updateCampaignStatus = async(req, res ) => {
  const id = req.params.id;
  const result = await alterCampaignStatus(id, req.body);
  return response.ok(res, result);
};

exports.getCampaignsMobile = async(req, res ) => {
  const result = await fetchCampaignMobile(req.query);
  return response.ok(res, result);
};

exports.getCampaignsMobileById = async(req, res ) => {
  const result = await fetchCampaignMobileById(req.params.id, req.userData.id, req.query);
  return response.ok(res, result);
};
