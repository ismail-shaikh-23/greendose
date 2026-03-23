import { privateRequest } from "../axios";

const ENDPOINTS = {
  ROLE: "/role",
  ROLE_ID: (id) => `/role/${id}`,
};

const getRoles = async (params) => {
  const response = await privateRequest.get(ENDPOINTS.ROLE, { params });
  return response?.data;
};

const getRoleById = async (id) => {
  const response = await privateRequest.get(ENDPOINTS.ROLE_ID(id));
  return response?.data;
};

const addRole = async (data) => {
  const response = await privateRequest.post(ENDPOINTS.ROLE, data);
  return response?.data;
};

const updateRole = async (id, data) => {
  const response = await privateRequest.put(ENDPOINTS.ROLE_ID(id), data);
  return response?.data;
};

const deleteRole = async (id) => {
  const response = await privateRequest.delete(ENDPOINTS.ROLE_ID(id));
  return response?.data;
};

const RoleService = {
  getRoles,
  getRoleById,
  addRole,
  updateRole,
  deleteRole,
};

export default RoleService;
