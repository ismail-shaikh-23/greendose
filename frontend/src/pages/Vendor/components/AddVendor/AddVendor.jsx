import Button from "@/components/Button/Button";
import Modal from "@/components/Modal/Modal";
import {
  MODAL_ID,
  VALIDATION_ERROR_MESSAGES,
  VENDOR_TYPES,
} from "@/lib/constants";
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
import styles from "./AddVendor.module.scss";
import toast from "@/lib/toast";
import VendorService from "@/services/api/vendor";
import formRenderer from "@/lib/formRenderer";
import { emailRegex, mobileRegex, zipCodeRegex } from "@/lib/regex";
import LoadingText from "@/components/LoadingText/LoadingText";

const AddVendor = ({ getData }) => {
  const { modalOpen } = useSelector((state) => state.global);
  const dispatch = useDispatch();

  const isEdit = !!modalOpen.data;
  const heading = `${isEdit ? "Update" : "Add"} Vendor `;

  const vendorTypeOptions = useMemo(
    () => getSelectOptions(Object.entries(VENDOR_TYPES), "1", "0"),
    []
  );

  const formConfig = useMemo(
    () => ({
      organizationName: {
        defaultValue: modalOpen?.data?.organizationName || "",
        validations: {
          required: requiredMessage("Vendor name"),
        },
        controlType: "input",
        label: "Organization Name",
        isRequired: true,
      },
      type: {
        defaultValue:
          vendorTypeOptions?.find(
            (option) => option.value === modalOpen?.data?.type
          ) || null,
        validations: {
          required: requiredMessage("Vendor type"),
        },
        controlType: "select",
        label: "Vendor Type",
        isRequired: true,
        isControlled: true,
        props: { options: vendorTypeOptions },
      },
      licenseId: {
        defaultValue: modalOpen?.data?.licenseId || "",
        validations: {
          required: requiredMessage("License ID"),
        },
        controlType: "input",
        label: "License ID",
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
      mobileNumber: {
        defaultValue: modalOpen?.data?.mobileNumber || "",
        validateions: {
          required: requiredMessage("Mobile Number"),
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
      addressName: {
        defaultValue: modalOpen?.data?.addressName || "",
        validations: {
          required: requiredMessage("Address"),
        },
        controlType: "input",
        label: "Address",
        isRequired: true,
      },
      addressStreet: {
        defaultValue: modalOpen?.data?.addressStreet || "",
        validations: {
          required: requiredMessage("Street"),
        },
        controlType: "input",
        label: "Street",
        isRequired: true,
      },
      addressZipcode: {
        defaultValue: modalOpen?.data?.addressZipcode || "",
        validations: {
          required: requiredMessage("ZIP code"),
          pattern: {
            value: zipCodeRegex,
            message: VALIDATION_ERROR_MESSAGES.ZIP_CODE_FORMAT,
          },
        },
        controlType: "input",
        label: "ZIP Code",
        isRequired: true,
      },
      addressCountry: {
        defaultValue: modalOpen?.data?.addressCountry || "",
        validations: {
          required: requiredMessage("Country"),
        },
        controlType: "input",
        label: "Country",
        isRequired: true,
      },
      addressState: {
        defaultValue: modalOpen?.data?.addressState || "",
        validations: {
          required: requiredMessage("State"),
        },
        controlType: "input",
        label: "State",
        isRequired: true,
      },
      addressCity: {
        defaultValue: modalOpen?.data?.addressCity || "",
        validations: {
          required: requiredMessage("City"),
        },
        controlType: "input",
        label: "City",
        isRequired: true,
      },
    }),
    [modalOpen?.data, vendorTypeOptions]
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
    const payload = { ...values, type: values?.type?.value };
    const data = isEdit
      ? await VendorService.updateVendor(modalOpen?.data?.id, payload)
      : await VendorService.addVendor(payload);
    if (data) {
      toast.success(
        data.message || `Vendor ${isEdit ? "updated" : "created"} successfully`
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
      modalOpen={modalOpen?.id === MODAL_ID.ADD_VENDOR}
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

export default AddVendor;
