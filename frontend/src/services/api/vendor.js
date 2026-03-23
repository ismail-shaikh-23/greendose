import { privateRequest, publicRequest } from "../axios";

const ENDPOINTS = {
  VENDOR: "/vendor",
  VENDOR_ID: (id) => `/vendor/${id}`,
  UPDATE_STATUS: (id) => `/vendor/status/${id}`,
  REGISTER_VENDOR : "/vendor/register",
  SHARE_BUTTON : "/vendor/send/email"
};

const getVendors = async (params) => {
  const response = await privateRequest.get(ENDPOINTS.VENDOR, { params });
  return response?.data;
};

const getVendorById = async (id) => {
  const response = await privateRequest.get(ENDPOINTS.VENDOR_ID(id));
  return response?.data;
};

const addVendor = async (data) => {
  const response = await privateRequest.post(ENDPOINTS.VENDOR, data);
  return response?.data;
};

const updateVendor = async (id, data) => {
  const response = await privateRequest.put(ENDPOINTS.VENDOR_ID(id), data);
  return response?.data;
};

const updateVendorStatus = async (id, data) => {
  const response = await privateRequest.put(ENDPOINTS.UPDATE_STATUS(id), data);
  return response?.data;
};

const deleteVendor = async (id) => {
  const response = await privateRequest.delete(ENDPOINTS.VENDOR_ID(id));
  return response?.data;
};

const registerVendor = async(data)=>{
  const response = await publicRequest.post(ENDPOINTS.REGISTER_VENDOR,data);
  return response?.data
}


const shareButton = async (data) => {
  
    const response = await privateRequest.post(ENDPOINTS.SHARE_BUTTON, data);
    return response?.data;
  
};
const VendorService = {
  getVendors,
  getVendorById,
  addVendor,
  updateVendor,
  updateVendorStatus,
  deleteVendor,
  registerVendor,
  shareButton
};

export default VendorService;
