import React, { useMemo } from "react";
import loginLogo from "@/assets/png/login_logo.png";
import styles from "./VendorRegistration.module.scss";
import { emailRegex, mobileRegex, zipCodeRegex } from "@/lib/regex";
import {
  combineClasses,
  getInitialValues,
  getSelectOptions,
  requiredMessage,
} from "@/lib/utils";
import { VALIDATION_ERROR_MESSAGES, VENDOR_TYPES } from "@/lib/constants";
import formRenderer from "@/lib/formRenderer";
import { useForm } from "react-hook-form";
import Button from "@/components/Button/Button";
import { useNavigate } from "react-router-dom";
import routes from "@/routes/routes";
import VendorService from "@/services/api/vendor";
import toast from "react-hot-toast";
const VendorRegistration = () => {
  const navigate = useNavigate();

  const vendorTypeOptions = useMemo(
    () => getSelectOptions(Object.entries(VENDOR_TYPES), "1", "0"),
    []
  );
  const formConfig = useMemo(
    () => ({
      organizationName: {
        defaultValue: "",
        validations: {
          required: requiredMessage("Vendor name"),
        },
        controlType: "input",
        label: "Vendor Name",
        isRequired: true,
      },
      type: {
        defaultValue: null,
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
        defaultValue: "",
        validations: {
          required: requiredMessage("License ID"),
        },
        controlType: "input",
        label: "License ID",
        isRequired: true,
      },
      userName: {
        defaultValue: "",
        validations: {
          required: requiredMessage("User name"),
        },
        controlType: "input",
        label: "User Name",
        isRequired: true,
      },
      email: {
        defaultValue: "",
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
        defaultValue: "",
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
      },
      addressName: {
        defaultValue: "",
        validations: {
          required: requiredMessage("Address"),
        },
        controlType: "input",
        label: "Address",
        isRequired: true,
      },
      addressStreet: {
        defaultValue: "",
        validations: {
          required: requiredMessage("Street"),
        },
        controlType: "input",
        label: "Street",
        isRequired: true,
      },
      addressZipcode: {
        defaultValue: "",
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
        defaultValue: "",
        validations: {
          required: requiredMessage("Country"),
        },
        controlType: "input",
        label: "Country",
        isRequired: true,
      },
      addressState: {
        defaultValue: "",
        validations: {
          required: requiredMessage("State"),
        },
        controlType: "input",
        label: "State",
        isRequired: true,
      },
      addressCity: {
        defaultValue: "",
        validations: {
          required: requiredMessage("City"),
        },
        controlType: "input",
        label: "City",
        isRequired: true,
      },
    }),
    []
  );

  const { control, register, formState, handleSubmit } = useForm({
    defaultValues: getInitialValues(formConfig),
    mode: "onTouched",
  });
  const { isSubmitting, isValid } = formState;
  const registerVendor = (values) => {
    const payload = {
      ...values,
      type: values.type.value
    };

    return VendorService.registerVendor(payload)
      .then((response) => {
        if (response?.error) {
          throw new Error(response.error);
        }
        toast.success("Vendor registered successfully!");

        navigate(routes.publicRoutes.LOGIN.path);
      })
      .catch((error) => {
        throw new Error(
          error.response?.data?.error || error?.message || "Login failed"
        );
      });
  };

  const onSubmit = async (values) => {
    const p = registerVendor(values);
    await toast.promise(p, {
      loading: "Registering...",
      success: () => "Registration Sucessful",
      error: (err) => err?.message,
    });
  };
  return (
    <div className={styles.mainDiv}>
      <div className={styles.login_logo}>
        <img src={loginLogo} alt="logo" width={320} />
      </div>
      <p className={styles.heading}>Wellness for All Waste for None</p>
      <form
        className={styles.formContainer}
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <div className={styles.form}>
          {formRenderer(formConfig, formState, register, control)}
          <Button
            type="submit"
            className={combineClasses(
              styles.button,
              isValid && styles.activeButton
            )}
            disabled={isSubmitting || !isValid}
          >
            {isSubmitting ? "Registering.." : "Register"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default VendorRegistration;
