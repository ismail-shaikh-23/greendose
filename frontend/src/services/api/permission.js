import { privateRequest } from "../axios";

const ENDPOINTS = {
  PERMISSION: "/permission",
  PERMISSION_ID: (id) => `/permission/${id}`,
};

const getPermissions = async (params) => {
  const response = await privateRequest.get(ENDPOINTS.PERMISSION, { params });
  return response?.data;
};

const getPermissionById = async (id) => {
  const response = await privateRequest.get(ENDPOINTS.PERMISSION_ID(id));
  return response?.data;
};

const addPermission = async (data) => {
  const response = await privateRequest.post(ENDPOINTS.PERMISSION, data);
  return response?.data;
};

const updatePermission = async (id, data) => {
  const response = await privateRequest.put(ENDPOINTS.PERMISSION_ID(id), data);
  return response?.data;
};

const deletePermission = async (id) => {
  const response = await privateRequest.delete(ENDPOINTS.PERMISSION_ID(id));
  return response?.data;
};

const PermissionService = {
  getPermissions,
  getPermissionById,
  addPermission,
  updatePermission,
  deletePermission,
};

export default PermissionService;
