import Button from "@/components/Button/Button";
import Modal from "@/components/Modal/Modal";
import {
  MODAL_ID,
  OFFER_TYPES,
  DISCOUNT_TYPES,
  VALIDATION_ERROR_MESSAGES,
} from "@/lib/constants";
import {
  addBaseUrl,
  getInitialValues,
  getSelectOptions,
  inputDateFormat,
  onlyNumbersInput,
  requiredMessage,
} from "@/lib/utils";
import { setModalOpen } from "@/store/slices/globalSlice";
import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import styles from "./AddOffer.module.scss";
import toast from "@/lib/toast";
import OfferService from "@/services/api/offer";
import formRenderer from "@/lib/formRenderer";
import { numberRegex } from "@/lib/regex";
import LoadingText from "@/components/LoadingText/LoadingText";

const arrayFields = {
  minPrice: {
    defaultValue: "",
    controlType: "input",
    label: "Min Price",
    isRequired: true,
  },
  maxPrice: {
    defaultValue: "",
    controlType: "input",
    label: "Max Price",
    isRequired: true,
  },
  minDiscount: {
    defaultValue: "",
    controlType: "input",
    label: "Min Discount",
    isRequired: true,
  },
  maxDiscount: {
    defaultValue: "",
    controlType: "input",
    label: "Max Discount",
    isRequired: true,
  },
};

const AddOffer = ({ getData }) => {
  const { modalOpen } = useSelector((state) => state.global);
  const dispatch = useDispatch();

  const isEdit = !!modalOpen.data;
  const heading = `${isEdit ? "Update" : "Add"} Offer`;

  const offerTypeOptions = useMemo(
    () => getSelectOptions(Object.entries(OFFER_TYPES), "1", "0"),
    []
  );

  const discountTypeOptions = useMemo(
    () => getSelectOptions(Object.entries(DISCOUNT_TYPES), "1", "0"),
    []
  );

  const formConfig = useMemo(
    () => ({
      name: {
        defaultValue: modalOpen?.data?.name || "",
        validations: {
          required: requiredMessage("Offer name"),
        },
        controlType: "input",
        label: "Offer Name",
        isRequired: true,
      },
      type: {
        defaultValue:
          offerTypeOptions?.find(
            (option) => option.value === modalOpen?.data?.type
          ) || null,
        validations: {
          required: requiredMessage("Offer type"),
        },
        controlType: "select",
        label: "Offer Type",
        isRequired: true,
        isControlled: true,
        props: { options: offerTypeOptions },
      },
      discountType: {
        defaultValue:
          discountTypeOptions?.find(
            (option) => option.value === modalOpen?.data?.discountType
          ) || null,
        validations: {
          required: requiredMessage("Discount type"),
        },
        controlType: "select",
        label: "Discount Type",
        isRequired: true,
        isControlled: true,
        props: { options: discountTypeOptions },
      },
      discountValue: {
        defaultValue: +modalOpen?.data?.discountValue || "",
        validations: {
          required: requiredMessage("Discount value"),
          pattern: {
            value: numberRegex,
            message: VALIDATION_ERROR_MESSAGES.ONLY_NUMBERS,
          },
        },
        controlType: "input",
        label: "Discount Value",
        isRequired: true,
        props: {
          type: "number",
          onKeyDown: onlyNumbersInput,
        },
      },
      startDate: {
        defaultValue: modalOpen?.data?.startDate
          ? inputDateFormat(modalOpen?.data?.startDate)
          : "",
        validations: {
          required: requiredMessage("Start date"),
        },
        controlType: "input",
        label: "Start Date",
        isRequired: true,
        props: {
          type: "date",
        },
      },
      endDate: {
        defaultValue: modalOpen?.data?.endDate
          ? inputDateFormat(modalOpen?.data?.endDate)
          : "",
        validations: {
          required: requiredMessage("End date"),
        },
        controlType: "input",
        label: "End Date",
        isRequired: true,
        props: {
          type: "date",
        },
      },
         files: {
        // defaultValue:
        //   modalOpen?.data?.images?.map?.(
        //     (row) => addBaseUrl(row?.image?.path)
        //   ) ?? [],
 defaultValue:
          modalOpen?.data?.imagePath
           ? [addBaseUrl(modalOpen?.data?.imagePath)]
           :[],
            
          // defaultValue: modalOpen?.data?.imageDetails?.path
          //   ? [addBaseUrl(modalOpen?.data?.imageDetails?.path)]
          //   : [],
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
      // priority: {
      //   defaultValue: modalOpen?.data?.priority || 1,
      //   controlType: "range",
      //   label: "Priority",
      //   isControlled: true,
      //   props: {
      //     min: 1,
      //     max: 4,
      //     step: 1,
      //   },
      // },
      // slabs: {
      //   defaultValue: [],
      //   validations: {},
      //   controlType: "fieldArray",
      //   label: "Slabs",
      //   isControlled: true,
      //   props: {
      //     arrayFields,
      //   },
      // },
    }),
    [modalOpen?.data, offerTypeOptions, discountTypeOptions]
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
      discountValue: +values?.discountValue,
      type: values?.type?.value,
      discountType: values?.discountType?.value,
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
      ? await OfferService.updateOffer(modalOpen?.data?.id,  formData)
      : await OfferService.addOffer(formData);
    if (data) {
      toast.success(
        data.message || `Offer ${isEdit ? "updated" : "created"} successfully`
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
      modalOpen={modalOpen?.id === MODAL_ID.ADD_OFFER}
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

export default AddOffer;
