import Button from "@/components/Button/Button";
import Modal from "@/components/Modal/Modal";
import { MODAL_ID, UNIT_TYPES } from "@/lib/constants";
import {
  getInitialValues,
  getSelectOptions,
  inputDateFormat,
  onlyNumbersInput,
  requiredMessage,
   addBaseUrl
} from "@/lib/utils";
import { setModalOpen } from "@/store/slices/globalSlice";
import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import styles from "./AddProduct.module.scss";
import toast from "@/lib/toast";
import ProductService from "@/services/api/product";
import { getSubCategory } from "@/store/slices/subCategorySlice";
import { getVendors } from "@/store/slices/vendorSlice";
import formRenderer from "@/lib/formRenderer";
import LoadingText from "@/components/LoadingText/LoadingText";
import { getProduct } from "@/store/slices/productSlice";
import { getOffers } from "@/store/slices/offerSlice";


const arrayFields = {
  tagInput: {
    defaultValue: "",
    controlType: "input",
    label: "Tag",
    validations: {
      required: requiredMessage("This field"),
    },
    isRequired: true,
  },
};

const AddProduct = ({ getData }) => {
  const { modalOpen } = useSelector((state) => state.global);

  const { subCategory } = useSelector((state) => state.subCategory);
  const { vendors } = useSelector((state) => state.vendor);
  const { offers } = useSelector((state) => state.offer);

  const dispatch = useDispatch();

  const isEdit = !!modalOpen.data;
  const heading = `${isEdit ? "Update" : "Add"} Product`;

  const subCategoryOptions = useMemo(
    () => getSelectOptions(subCategory),
    [subCategory]
  );

  const vendorOptions = useMemo(
    () => getSelectOptions(vendors, "organizationName"),
    [vendors]
  );

  const offersOptions = useMemo(() => getSelectOptions(offers), [offers]);

  const unitTypeOptions = useMemo(
    () => getSelectOptions(Object.entries(UNIT_TYPES), "1", "0"),
    []
  );

  const formConfig = useMemo(
    () => ({
      name: {
        defaultValue: modalOpen?.data?.name ?? "",
        validations: {
          required: requiredMessage("Product name"),
        },
        controlType: "input",
        label: "Product Name",
        isRequired: true,
      },
      brand: {
        defaultValue: modalOpen?.data?.brand ?? "",
        validations: {
          required: requiredMessage("Brand name"),
        },
        controlType: "input",
        label: "Brand Name",
        isRequired: true,
      },
      price: {
        defaultValue: modalOpen?.data?.price ?? "",
        validations: {
          required: requiredMessage("Product price"),
        },
        controlType: "input",
        label: "Price",
        isRequired: true,
        props: {
          type: "number",
          onKeyDown: onlyNumbersInput,
        },
      },
      expiryDate: {
        defaultValue: modalOpen?.data?.expiryDate
          ? inputDateFormat(modalOpen?.data?.expiryDate)
          : "",
        validations: {
          required: requiredMessage("Product Expiry Date"),
        },
        controlType: "input",
        label: "Expiry Date",
        isRequired: true,
        props: {
          type: "date",
        },
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
    multiple: true,
    accept: "image/*",
  },
},

      subCategoryId: {
        defaultValue:
          subCategoryOptions.find(
            (option) => option.value === modalOpen?.data?.subCategoryId
          ) ?? "",
        validations: {
          required: requiredMessage("Sub Category"),
        },
        controlType: "select",
        label: "Sub Category",
        isRequired: true,
        isControlled: true,
        props: { options: subCategoryOptions },
      },
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
      offerId: {
        defaultValue:
          offersOptions.find(
          (option) => option.value === modalOpen?.data?.offerProducts?.[0]?.offer?.id
          ) ?? "",
        controlType: "select",
        label: "Offer",
        isControlled: true,
        props: { options: offersOptions },
      },
      quantity: {
        defaultValue: modalOpen?.data?.quantity ?? "",
        validations: {
          required: requiredMessage("Quantity"),
        },
        controlType: "input",
        label: "Quantity",
        isRequired: true,
        props: {
          type: "number",
          onKeyDown: onlyNumbersInput,
        },
      },
      weight: {
        defaultValue: modalOpen?.data?.weight ?? "",
        validations: {
          required: requiredMessage("Weight"),
        },
        controlType: "input",
        label: "Weight",
        isRequired: true,
        props: {
          type: "number",
          onKeyDown: onlyNumbersInput,
        },
      },
      unit: {
        defaultValue:
          unitTypeOptions.find(
            (option) => option.value === modalOpen?.data?.unit
          ) ?? "",
        validations: {
          required: requiredMessage("Unit"),
        },
        controlType: "select",
        label: "Unit",
        isRequired: true,
        isControlled: true,
        props: {
          options: unitTypeOptions
        },
      },
      description: {
        defaultValue: modalOpen?.data?.description ?? "",
        validations: {
          required: requiredMessage("Product description"),
        },
        controlType: "markdown",
        label: "Product Description",
        isRequired: true,
        isControlled: true,
      },
      tags: {
        defaultValue: modalOpen?.data?.tags?.map((tagInput) => ({
          tagInput,
        })) ?? [getInitialValues(arrayFields)],
        validations: {},
        controlType: "fieldArray",
        label: "Tags",
        isControlled: true,
        props: {
          arrayFields,
          wrap: true,
        },
      },
      isPrescriptionRequired: {
        defaultValue: modalOpen?.data?.isPrescriptionRequired ?? false,
        controlType: "checkbox",
        label: "Prescription Required",
      },
    }),
    [
      modalOpen?.data,
      subCategoryOptions,
      vendorOptions,
      unitTypeOptions,
      offersOptions,
    ]
  );

  const { register, handleSubmit, control, formState, reset } = useForm({
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
      subCategoryId: values?.subCategoryId?.value,
      vendorId: values?.vendorId?.value,
      offerId: values?.offerId?.value,
      unit: values?.unit?.value,
      tags: values?.tags?.map?.((x) => x.tagInput) || [],
    };
    if (!payload?.offerId) {
      delete payload.offerId;
    }
    delete payload.offers;
    const formData = new FormData();
    for (const key in payload) {
      if (["files", "tags"].includes(key)) {
        for (const row of payload[key]) {
          formData.append(key, row);
        }
      } else {
        formData.append(key, payload[key]);
      }
    }

    const data = isEdit
      ? await ProductService.updateProduct(modalOpen?.data?.id, formData)
      : await ProductService.addProduct(formData);
    if (data) {
      toast.success(
        data.message || `Product ${isEdit ? "updated" : "created"} successfully`
      );
      getData?.();
      closeModal();
    }
  };

  useEffect(() => {
    reset(getInitialValues(formConfig));
  }, [modalOpen.data, formConfig, reset]);

  useEffect(() => {
    dispatch(getSubCategory({allRecords : true }));
    dispatch(getVendors({ status: "approved" , allRecords : true }));
    dispatch(getOffers({ status: "active", allRecords : true  }));
  }, [dispatch]);

  return (
    <Modal
      modalOpen={modalOpen?.id === MODAL_ID.ADD_PRODUCT}
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

export default AddProduct;
