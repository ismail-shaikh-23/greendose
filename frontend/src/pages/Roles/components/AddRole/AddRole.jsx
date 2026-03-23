import Button from "@/components/Button/Button";
import FormControl from "@/components/FormControl/FormControl";
import Modal from "@/components/Modal/Modal";
import { MODAL_ID } from "@/lib/constants";
import { getInitialValues, requiredMessage } from "@/lib/utils";
import { setModalOpen } from "@/store/slices/globalSlice";
import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import styles from "./AddRole.module.scss";
import toast from "@/lib/toast";
import RoleService from "@/services/api/role";
import LoadingText from "@/components/LoadingText/LoadingText";

const AddRole = ({ getData }) => {
  const { modalOpen } = useSelector((state) => state.global);
  const dispatch = useDispatch();

  const isEdit = !!modalOpen.data;
  const heading = `${isEdit ? "Update" : "Add"} Role`;

  const formConfig = useMemo(
    () => ({
      name: {
        defaultValue: modalOpen?.data?.name || "",
        validations: {
          required: requiredMessage("Role name"),
        },
        controlType: "input",
        label: "Role Name",
        isRequired: true,
      },
      description: {
        defaultValue: modalOpen?.data?.description || "",
        validations: {
          required: requiredMessage("Role description"),
        },
        controlType: "input",
        label: "Role Description",
        isRequired: true,
      },
    }),
    [modalOpen?.data]
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
      ? await RoleService.updateRole(modalOpen?.data?.id, values)
      : await RoleService.addRole(values);
    if (data) {
      toast.success(
        data.message || `Role ${isEdit ? "updated" : "created"} successfully`
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
      modalOpen={modalOpen?.id === MODAL_ID.ADD_ROLE}
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
          <Button atype="button" onClick={closeModal} outlined>
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

export default AddRole;
