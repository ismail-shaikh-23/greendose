import { privateRequest } from "../axios";

const ENDPOINTS = {
  CAMPAIGN: "/campaign",
  CAMPAIGN_ID: (id) => `/campaign/${id}`,
};

const getCampaign = async (params) => {
  const response = await privateRequest.get(ENDPOINTS.CAMPAIGN, { params });
  return response?.data;
};

const getCampaignById = async (id) => {
  const response = await privateRequest.get(ENDPOINTS.CAMPAIGN_ID(id));
  return response?.data;
};

const addCampaign = async (data) => {
  const response = await privateRequest.post(ENDPOINTS.CAMPAIGN, data);
  return response?.data;
};

const updateCampaign = async (id, data) => {
  const response = await privateRequest.put(ENDPOINTS.CAMPAIGN_ID(id), data);
  return response?.data;
};

const deleteCampaign = async (id) => {
  const response = await privateRequest.delete(ENDPOINTS.CAMPAIGN_ID(id));
  return response?.data;
};

const CampaignService = {
  getCampaign,
  getCampaignById,
  addCampaign,
  updateCampaign,
  deleteCampaign,
};

export default CampaignService;
