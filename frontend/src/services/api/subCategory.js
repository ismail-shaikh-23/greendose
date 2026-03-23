import { privateRequest } from "../axios";

const ENDPOINTS = {
  SUB_CATEGORY: "/sub-category",
  SUB_CATEGORY_ID: (id) => `/sub-category/${id}`,
};

const getSubCategory = async (params) => {
  const response = await privateRequest.get(ENDPOINTS.SUB_CATEGORY, { params });
  return response?.data;
};

const getSubCategoryById = async (id) => {
  const response = await privateRequest.get(ENDPOINTS.SUB_CATEGORY_ID(id));
  return response?.data;
};

const addSubCategory = async (data) => {
  const response = await privateRequest.post(ENDPOINTS.SUB_CATEGORY, data);
  return response?.data;
};

const updateSubCategory = async (id, data) => {
  const response = await privateRequest.put(
    ENDPOINTS.SUB_CATEGORY_ID(id),
    data
  );
  return response?.data;
};

const deleteSubCategory = async (id) => {
  const response = await privateRequest.delete(ENDPOINTS.SUB_CATEGORY_ID(id));
  return response?.data;
};

const SubCategoryService = {
  getSubCategory,
  getSubCategoryById,
  addSubCategory,
  updateSubCategory,
  deleteSubCategory,
};

export default SubCategoryService;
