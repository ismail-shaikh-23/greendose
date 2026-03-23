import { privateRequest } from "../axios";

const ENDPOINTS = {
  USER: "/user",
  USER_ID: (id) => `/user/${id}`,
};

const getUsers = async (params) => {
  const response = await privateRequest.get(ENDPOINTS.USER, { params });
  return response?.data;
};

const getUserById = async (id) => {
  const response = await privateRequest.get(ENDPOINTS.USER_ID(id));
  return response?.data;
};

const addUser = async (data) => {
  const response = await privateRequest.post(ENDPOINTS.USER, data);
  return response?.data;
};

const updateUser = async (id, data) => {
  const response = await privateRequest.put(ENDPOINTS.USER_ID(id), data);
  return response?.data;
};

const deleteUser = async (id) => {
  const response = await privateRequest.delete(ENDPOINTS.USER_ID(id));
  return response?.data;
};

const UserService = {
  getUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
};

export default UserService;
