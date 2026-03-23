import Button from "@/components/Button/Button";
import FormControl from "@/components/FormControl/FormControl";
import Modal from "@/components/Modal/Modal";
import { MODAL_ID } from "@/lib/constants";
import { getInitialValues, requiredMessage } from "@/lib/utils";
import { setModalOpen } from "@/store/slices/globalSlice";
import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import styles from "./AddPermission.module.scss";
import toast from "@/lib/toast";
import PermissionService from "@/services/api/permission";
import LoadingText from "@/components/LoadingText/LoadingText";

const AddPermission = ({ getData }) => {
  const { modalOpen } = useSelector((state) => state.global);
  const dispatch = useDispatch();

  const isEdit = !!modalOpen.data;
  const heading = `${isEdit ? "Update" : "Add"} Permission`;

  const formConfig = useMemo(
    () => ({
      actionName: {
        defaultValue: modalOpen?.data?.actionName || "",
        validations: {
          required: requiredMessage("Permission name"),
        },
        controlType: "input",
        label: "Permission Name",
        isRequired: true,
        props: {
          disabled: isEdit,
        },
      },
      description: {
        defaultValue: modalOpen?.data?.description || "",
        validations: {
          required: requiredMessage("Permission description"),
        },
        controlType: "input",
        label: "Permission Description",
        isRequired: true,
      },
      method: {
        defaultValue: modalOpen?.data?.method || "",
        validations: {
          required: requiredMessage("Method"),
        },
        controlType: "input",
        label: "Method",
        isRequired: true,
      },
      baseUrl: {
        defaultValue: modalOpen?.data?.baseUrl || "",
        validations: {
          required: requiredMessage("Base URL"),
        },
        controlType: "input",
        label: "Base URL",
        isRequired: true,
      },
      path: {
        defaultValue: modalOpen?.data?.path || "",
        validations: {
          required: requiredMessage("Path"),
        },
        controlType: "input",
        label: "Path",
        isRequired: true,
      },
    }),
    [modalOpen?.data, isEdit]
  );

  const { register, handleSubmit, formState, reset } = useForm({
    defaultValues: getInitialValues(formConfig),
    mode: "onTouched",
  });

  const closeModal = () => {
    reset();
    dispatch(setModalOpen(false));
  };

  const onSubmit = async (values) => {
    const data = isEdit
      ? await PermissionService.updatePermission(modalOpen?.data?.id, values)
      : await PermissionService.addPermission(values);
    if (data) {
      toast.success(
        data.message ||
          `Permission ${isEdit ? "updated" : "created"} successfully`
      );
      getData?.();
      closeModal();
    }
  };

  useEffect(() => {
    reset(getInitialValues(formConfig));
  }, [modalOpen.data, formConfig, reset]);

  return (
    <Modal
      modalOpen={modalOpen?.id === MODAL_ID.ADD_PERMISSION}
      closeModal={closeModal}
      heading={heading}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles.form}
        autoComplete="off"
      >
        <div className={styles.main}>
          {Object.entries(formConfig).map(([name, obj]) => {
            if (obj?.hide) return;
            return (
              <FormControl
                key={name}
                name={name}
                register={register}
                controlType={obj.controlType}
                label={obj.label}
                placeholder={`Enter ${obj.label}`}
                validations={obj.validations}
                errorMessage={formState?.errors?.[name]?.message}
                isRequired={obj.isRequired}
                autoComplete="off"
                {...(obj.props || {})}
              />
            );
          })}
        </div>
        <div className={styles.buttonsContainer}>
          <Button type="button" onClick={closeModal} outlined>
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

export default AddPermission;
