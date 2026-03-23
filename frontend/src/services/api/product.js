import { privateRequest } from "../axios";

const ENDPOINTS = {
  PRODUCT: "/product",
  PRODUCT_ID: (id) => `/product/${id}`,
};

const getProduct = async (params) => {
  const response = await privateRequest.get(ENDPOINTS.PRODUCT, { params });
  return response?.data;
};

const getProductById = async (id) => {
  const response = await privateRequest.get(ENDPOINTS.PRODUCT_ID(id));
  return response?.data;
};

const addProduct = async (data) => {
  const response = await privateRequest.post(ENDPOINTS.PRODUCT, data);
  return response?.data;
};

const updateProduct = async (id, data) => {
  const response = await privateRequest.put(ENDPOINTS.PRODUCT_ID(id), data);
  return response?.data;
};

const deleteProduct = async (id) => {
  const response = await privateRequest.delete(ENDPOINTS.PRODUCT_ID(id));
  return response?.data;
};

const ProductService = {
  getProduct,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};

export default ProductService;
