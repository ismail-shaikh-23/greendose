import { privateRequest } from "../axios";

const ENDPOINTS = {
  OFFER: "/offer",
  OFFER_ID: (id) => `/offer/${id}`,
};

const getOffers = async (params) => {
  const response = await privateRequest.get(ENDPOINTS.OFFER, { params });
  return response?.data;
};

const getOfferById = async (id) => {
  const response = await privateRequest.get(ENDPOINTS.OFFER_ID(id));
  return response?.data;
};

const addOffer = async (data) => {
  const response = await privateRequest.post(ENDPOINTS.OFFER, data);
  return response?.data;
};

const updateOffer = async (id, data) => {
  const response = await privateRequest.put(ENDPOINTS.OFFER_ID(id), data);
  return response?.data;
};

const deleteOffer = async (id) => {
  const response = await privateRequest.delete(ENDPOINTS.OFFER_ID(id));
  return response?.data;
};

const OfferService = {
  getOffers,
  getOfferById,
  addOffer,
  updateOffer,
  deleteOffer,
};

export default OfferService;
