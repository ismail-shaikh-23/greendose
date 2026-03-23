import { privateRequest } from "../axios";

const ENDPOINTS = {
  ROLE_PERMISSION: "/role-permission",
  ROLE_PERMISSION_BULK_CHANGE: "/role-permission/bulk-change",
};

const bulkChangeRolePermission = async (id, data) => {
  const response = await privateRequest.post(
    ENDPOINTS.ROLE_PERMISSION_BULK_CHANGE,
    data,
    { params: { id } }
  );
  return response?.data;
};

const RolePermissionService = {
  bulkChangeRolePermission,
};

export default RolePermissionService;
