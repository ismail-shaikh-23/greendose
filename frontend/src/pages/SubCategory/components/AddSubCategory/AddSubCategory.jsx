import Button from "@/components/Button/Button";
import FormControl from "@/components/FormControl/FormControl";
import Modal from "@/components/Modal/Modal";
import { MODAL_ID } from "@/lib/constants";
import {
  addBaseUrl,
  getInitialValues,
  getSelectOptions,
  requiredMessage,
} from "@/lib/utils";
import { setModalOpen } from "@/store/slices/globalSlice";
import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import styles from "./AddSubCategory.module.scss";
import toast from "@/lib/toast";
import SubCategoryService from "@/services/api/subCategory";
import { getCategory } from "@/store/slices/categorySlice";
import LoadingText from "@/components/LoadingText/LoadingText";
import formRenderer from "@/lib/formRenderer";

const AddSubCategory = ({ getData }) => {
  const { modalOpen } = useSelector((state) => state.global);
  const { categories } = useSelector((state) => state.category);
  const dispatch = useDispatch();
  const isEdit = !!modalOpen.data;
  const heading = `${isEdit ? "Update" : "Add"} Sub-Category`;

  const categoryOptions = useMemo(
    () => getSelectOptions(categories),
    [categories]
  );

  const formConfig = useMemo(
    () => ({
      name: {
        defaultValue: modalOpen?.data?.name || "",
        validations: {
          required: requiredMessage("Sub Category name"),
        },
        controlType: "input",
        label: "Sub Category Name",
        isRequired: true,
      },
      categoryId: {
        defaultValue: modalOpen?.data?.category
          ? {
              label: modalOpen?.data?.category?.name,
              value: modalOpen?.data?.category?.id,
            }
          : "",
        validations: {
          required: requiredMessage("Category"),
        },
        controlType: "select",
        label: "Category",
        placeholder: "Select Category",
        isRequired: true,
        isControlled: true,
        props: { options: categoryOptions },
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
    [modalOpen?.data, categoryOptions]
  );

  const { register, control, handleSubmit, formState, reset } = useForm({
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
      categoryId: values?.categoryId?.value,
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
      ? await SubCategoryService.updateSubCategory(modalOpen?.data?.id, formData)
      : await SubCategoryService.addSubCategory(formData);
    if (data) {
      toast.success(
        data.message || `Sub Category ${isEdit ? "updated" : "created"} successfully`
      );
      getData?.();
      closeModal();
    }
  };

  useEffect(() => {
    reset(getInitialValues(formConfig));
  }, [modalOpen.data, formConfig, reset]);

  useEffect(() => {
    dispatch(getCategory({allRecords : true }));
  }, [dispatch]);

  return (
    <Modal
      modalOpen={modalOpen?.id === MODAL_ID.ADD_SUBCATEGORY}
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

export default AddSubCategory;
