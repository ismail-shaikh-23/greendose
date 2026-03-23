import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./RolePermission.module.scss";
import Button from "@/components/Button/Button";

//icons
import toast from "@/lib/toast";
import { getInitialValues, requiredMessage } from "@/lib/utils";
import RoleService from "@/services/api/role";
import { useForm } from "react-hook-form";
import ArrowIcon from "@/components/SVGComponents/ArrowIcon";
import PermissionService from "@/services/api/permission";
import formRenderer from "@/lib/formRenderer";
import RolePermissionService from "@/services/api/rolePermission";

const RolePermission = () => {
  const [roleDetails, setRoleDetails] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [permissionIds, setPermissionIds] = useState([]);

  const { roleId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formConfig = useMemo(
    () => ({
      name: {
        defaultValue: roleDetails?.name || "",
        validations: {
          required: requiredMessage("Role name"),
        },
        controlType: "input",
        label: "Role Name",
        isRequired: true,
      },
      description: {
        defaultValue: roleDetails?.description || "",
        validations: {
          required: requiredMessage("Role description"),
        },
        controlType: "input",
        label: "Role Description",
        isRequired: true,
      },
    }),
    [roleDetails]
  );

  const { register, handleSubmit, isSubmitting, formState, reset } = useForm({
    defaultValues: getInitialValues(formConfig),
    mode: "onTouched",
  });

  const backToRoles = () => {
    navigate(-1);
  };

  const onSubmit = async (values) => {
    const data = roleId
      ? await RoleService.updateRole(roleId, values)
      : await RoleService.addRole(values);
    const permData = await RolePermissionService.bulkChangeRolePermission(
      roleId,
      { permissionIds }
    );
    if (data && permData) {
      toast.success(data.message || `Role ${"created"} successfully`);
    }
  };

  const checkHasPermission = (id) => permissionIds?.includes(id);

  const selectPermission = (id) => () => {
    if (checkHasPermission(id)) {
      setPermissionIds((prev) => prev.filter((row) => row !== id));
    } else {
      setPermissionIds((prev) => [...prev, id]);
    }
  };

  const getAllPermissions = useCallback(async () => {
    const data = await PermissionService.getPermissions({ fetchAll: true });
    setPermissions(data?.data?.rows ?? []);
  }, []);

  const getRoleDetails = useCallback(async () => {
    if (!roleId) return;
    const data = await RoleService.getRoleById(roleId);
    setRoleDetails(data.data);
  }, [roleId]);

  useEffect(() => {
    getAllPermissions();
    getRoleDetails();
  }, [getRoleDetails, getAllPermissions, dispatch]);

  useEffect(() => {
    reset(getInitialValues(formConfig));
  }, [roleDetails, formConfig, reset]);

  useEffect(() => {
    setPermissionIds(roleDetails?.permissions?.map?.((p) => p?.id));
  }, [roleDetails]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <div className={styles.permissionsMain}>
        <div className={styles.topDiv}>
          <span className={styles.back} onClick={backToRoles}>
            <ArrowIcon className={styles.backIcon} />
            Back
          </span>
          <Button
            className={styles.button}
            type="submit"
            disabled={isSubmitting}
          >
            Submit
          </Button>
        </div>
        <div className={styles.form}>
          {formRenderer(formConfig, formState, register)}
        </div>

        <p className={styles.headingText}> Permissions</p>
        <div className={styles.permissionsContainer}>
          {permissions.map((permission) => {
            return (
              <span key={permission.id} className={styles.checkbox}>
                <input
                  id={permission.id}
                  type="checkbox"
                  checked={checkHasPermission(permission?.id) ?? false}
                  onChange={selectPermission(permission?.id)}
                />
                <label
                  htmlFor={permission.id}
                  className={styles.permissionName}
                >
                  {permission.actionName}
                </label>
              </span>
            );
          })}
        </div>
      </div>
    </form>
  );
};

export default RolePermission;
