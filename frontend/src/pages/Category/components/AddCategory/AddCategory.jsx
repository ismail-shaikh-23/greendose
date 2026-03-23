import Button from "@/components/Button/Button";
import FormControl from "@/components/FormControl/FormControl";
import Modal from "@/components/Modal/Modal";
import { MODAL_ID } from "@/lib/constants";
import { addBaseUrl, getInitialValues, requiredMessage } from "@/lib/utils";
import { setModalOpen } from "@/store/slices/globalSlice";
import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import styles from "../AddCategory/AddCategory.module.scss";
import toast from "@/lib/toast";
import CategoryService from "@/services/api/category";
import LoadingText from "@/components/LoadingText/LoadingText";
import formRenderer from "@/lib/formRenderer";

const AddCategory = ({ getData }) => {
  const { modalOpen } = useSelector((state) => state.global);
  const dispatch = useDispatch();

  const isEdit = !!modalOpen.data;
  const heading = `${isEdit ? "Update" : "Add"} Category`;

  const formConfig = useMemo(
    () => ({
      name: {
        defaultValue: modalOpen?.data?.name || "",
        validations: {
          required: requiredMessage("Category name"),
        },
        controlType: "input",
        label: "Category Name",
        isRequired: true,
      },
      files: {
        defaultValue:
           modalOpen?.data?.images?.map?.(
             (row) => addBaseUrl(row?.imageDetails?.path)
           ) ?? [],
        controlType: "file",
        label: "File",
        placeholder: "Select File",
        isRequired: true,
        isControlled: true,
        validations: {
          required: requiredMessage("Image"),
        },
        props: {
          multiple: false,
          accept: "image/*",
        },
      },
    }),
    [modalOpen?.data]
  );

  const { control, register, handleSubmit, formState, reset } = useForm({
    defaultValues: getInitialValues(formConfig),
    mode: "onTouched",
  });

  const closeModal = () => {
    reset();
    dispatch(setModalOpen(false));
  };

  const onSubmit = async (values) => {
    const payload = {
      ...values,
      // subCategoryId: [],
    };

    const formData = new FormData();
    for (const key in payload) {
      if (key === "files") {
        for (const file of payload[key]) {
          formData.append("files", file);
        }
      } else {
        formData.append(key, payload[key]);
      }
    }

    const data = isEdit
      ? await CategoryService.updateCategory(modalOpen?.data?.id, formData)
      : await CategoryService.addCategory(formData);
    if (data) {
      toast.success(
        data.message ||
          `Category ${isEdit ? "updated" : "created"} successfully`
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
      modalOpen={modalOpen?.id === MODAL_ID.ADD_CATEGORY}
      closeModal={closeModal}
      heading={heading}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles.form}
        autoComplete="off"
      >
        <div className={styles.main}>
          {formRenderer(formConfig, formState, register, control)}
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

export default AddCategory;
