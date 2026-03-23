import { privateRequest } from "../axios";

const ENDPOINTS = {
  CATEGORY: "/category",
  CATEGORY_ID: (id) => `/category/${id}`,
};

const getCategory = async (params) => {
  const response = await privateRequest.get(ENDPOINTS.CATEGORY, { params });
  return response?.data;
};

const getCategoryById = async (id) => {
  const response = await privateRequest.get(ENDPOINTS.CATEGORY_ID(id));
  return response?.data;
};

const addCategory = async (data) => {
  const response = await privateRequest.post(ENDPOINTS.CATEGORY, data);
  return response?.data;
};

const updateCategory = async (id, data) => {
  const response = await privateRequest.put(ENDPOINTS.CATEGORY_ID(id), data);
  return response?.data;
};

const deleteCategory = async (id) => {
  const response = await privateRequest.delete(ENDPOINTS.CATEGORY_ID(id));
  return response?.data;
};

const CategoryService = {
  getCategory,
  getCategoryById,
  addCategory,
  updateCategory,
  deleteCategory,
};

export default CategoryService;
