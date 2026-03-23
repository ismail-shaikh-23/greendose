import Button from "@/components/Button/Button";
import Modal from "@/components/Modal/Modal";
import { MODAL_ID, VALIDATION_ERROR_MESSAGES } from "@/lib/constants";
import { emailRegex, mobileRegex, passwordRegex } from "@/lib/regex";
import {
  getInitialValues,
  getSelectOptions,
  onlyNumbersInput,
  requiredMessage,
} from "@/lib/utils";
import { setModalOpen } from "@/store/slices/globalSlice";
import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import styles from "./AddUser.module.scss";
import toast from "@/lib/toast";
import UserService from "@/services/api/user";
import formRenderer from "@/lib/formRenderer";
import LoadingText from "@/components/LoadingText/LoadingText";
import { getVendors } from "@/store/slices/vendorSlice";
import { getRoles } from "@/store/slices/roleSlice";

const AddUser = ({ getData }) => {
  const { modalOpen } = useSelector((state) => state.global);
  const { vendors } = useSelector((state) => state.vendor);
  const { roles } = useSelector((state) => state.role);
  const dispatch = useDispatch();

  const roleOptions = useMemo(() => getSelectOptions(roles), [roles]);

  const vendorOptions = useMemo(
    () => getSelectOptions(vendors, "organizationName"),
    [vendors]
  );

  const isEdit = !!modalOpen.data;
  const heading = `${isEdit ? "Update" : "Add"} User `;

  const vendorField = useMemo(
    () => ({
      vendorId: {
        defaultValue:
          vendorOptions.find(
            (option) => option.value === modalOpen?.data?.vendorId
          ) ?? "",
        validations: {
          required: requiredMessage("Vendor"),
        },
        controlType: "select",
        label: "Vendor",
        isRequired: true,
        isControlled: true,
        props: { options: vendorOptions },
      },
    }),
    [modalOpen, vendorOptions]
  );

  const formConfig = useMemo(
    () => ({
      firstName: {
        defaultValue: modalOpen?.data?.firstName || "",
        validations: {
          required: requiredMessage("First name"),
          pattern: {
            value: /^[a-zA-Z\s'-]+$/,
            message: "First name should not contain special characters",
          },
        },
        controlType: "input",
        label: "First Name",
        isRequired: true,
      },
      lastName: {
        defaultValue: modalOpen?.data?.lastName || "",
        validations: {
          required: requiredMessage("Last name"),
          pattern: {
            value: /^[a-zA-Z\s'-]+$/,
            message: "Last name should not contain special characters",
          },
        },
        controlType: "input",
        label: "Last Name",
        isRequired: true,
      },
      userName: {
        defaultValue: modalOpen?.data?.userName || "",
        validations: {
          required: requiredMessage("User name"),
        },
        controlType: "input",
        label: "User Name",
        isRequired: true,
      },
      email: {
        defaultValue: modalOpen?.data?.email || "",
        validations: {
          required: requiredMessage("Email ID"),
          pattern: {
            value: emailRegex,
            message: VALIDATION_ERROR_MESSAGES.EMAIL_FORMAT,
          },
        },
        controlType: "input",
        label: "Email ID",
        isRequired: true,
      },
      password: {
        hide: isEdit,
        defaultValue: "",
        validations: {
          required: requiredMessage("Password"),
          pattern: {
            value: passwordRegex,
            message: VALIDATION_ERROR_MESSAGES.PASSWORD_FORMAT,
          },
        },
        controlType: "password",
        label: "Password",
        isRequired: true,
      },
      mobileNumber: {
        defaultValue: modalOpen?.data?.mobileNumber || "",
        validations: {
          required: requiredMessage("Mobile number"),
          pattern: {
            value: mobileRegex,
            message: VALIDATION_ERROR_MESSAGES.INVALID_MOBILE,
          },
        },
        controlType: "input",
        label: "Mobile Number",
        isRequired: true,
        props: {
          type: "number",
          onKeyDown: onlyNumbersInput,
        },
      },
      roleId: {
        defaultValue:
          roleOptions.find(
            (option) => option.value === modalOpen?.data?.roleId
          ) ?? "",
        validations: {
          required: requiredMessage("Role"),
        },
        controlType: "select",
        label: "Role",
        isRequired: true,
        isControlled: true,
        props: { options: roleOptions },
      },
    }),
    [isEdit, modalOpen?.data, roleOptions]
  );

  const { register, control, handleSubmit, formState, reset, watch } = useForm({
    defaultValues: getInitialValues(formConfig),
    mode: "onTouched",
  });

  const isVendorSelected =
    watch("roleId")?.label?.toLowerCase() === "vendoruser";

  const closeModal = () => {
    reset();
    dispatch(setModalOpen(false));
  };

  const onSubmit = async (values) => {
    const payload = {
      ...values,
      roleId: values?.roleId?.value,
    };
    if (values?.vendorId) {
      payload.vendorId = values?.vendorId?.value;
    }
    if (isEdit) {
      delete payload.password;
    }
    const data = isEdit
      ? await UserService.updateUser(modalOpen?.data?.id, payload)
      : await UserService.addUser(payload);
    if (data) {
      toast.success(
        data.message || `User ${isEdit ? "updated" : "created"} successfully`
      );
      getData?.();
      closeModal();
    }
  };

  useEffect(() => {
    reset(getInitialValues(formConfig));
  }, [modalOpen.data, formConfig, reset]);

  useEffect(() => {
    if (isVendorSelected) {
      reset((prev) => ({
        ...prev,
        ...getInitialValues(vendorField),
      }));
    } else {
      reset((prev) => {
        delete prev.vendorId;
        return prev;
      });
    }
  }, [isVendorSelected, reset, vendorField]);

  useEffect(() => {
    dispatch(getVendors({ status: "approved" }));
    dispatch(getRoles());
  }, [dispatch]);

  return (
    <Modal
      modalOpen={modalOpen?.id === MODAL_ID.ADD_USER}
      closeModal={closeModal}
      heading={heading}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles.form}
        autoComplete="off"
      >
        <div className={styles.main}>
          {formRenderer(
            {
              ...formConfig,
              ...(isVendorSelected ? vendorField : {}),
            },
            formState,
            register,
            control
          )}
        </div>
        <div className={styles.buttonsContainer}>
          <Button
            type="button"
            className={styles.cancelButton}
            onClick={closeModal}
            outlined
          >
            Cancel
          </Button>
          <Button
            className={styles.submitButton}
            type="submit"
            disabled={formState.isSubmitting || !formState.isValid}
          >
            {formState.isSubmitting ? (
              <LoadingText text="Submitting" />
            ) : (
              heading
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddUser;
