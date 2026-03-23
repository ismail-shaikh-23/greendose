import React from "react";
import styles from "./ForgotPassword.module.scss";
import { Link, useNavigate } from "react-router-dom";
import toast from "@/lib/toast";
import { emailRegex } from "@/lib/regex";
import FormControl from "@/components/FormControl/FormControl";
import { useForm } from "react-hook-form";
import { combineClasses, requiredMessage } from "@/lib/utils";
import Button from "@/components/Button/Button";
import routes from "@/routes/routes";
import { VALIDATION_ERROR_MESSAGES } from "@/lib/constants";
import AuthService from "@/services/api/auth";
import BackArrowIcon from "@/components/SVGComponents/BackArrowIcon";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const initialValues = {
    identifier: "",
  };

  const {
    register,
    handleSubmit,
    formState: { isSubmitting , errors, isValid},
  } = useForm({
    defaultValues: initialValues,
    mode: "onTouched",
  });

  const validations = {
    identifier: {
      required: requiredMessage("Email ID"),
      pattern: {
        value: emailRegex,
        message: VALIDATION_ERROR_MESSAGES.EMAIL_FORMAT,
      },
    },
  };


const forgotPassword = async (values) => {
  const res = await AuthService.forgotPassword(values);

  if (!res?.success) {
    throw new Error(res.message || "Unable to send OTP.");
  }

  navigate(routes.publicRoutes.OTP_VERIFICATION.path, {
    state: { email: values.identifier },
  });
};

const onSubmit = async (values) => {
  await toast.promise(
    forgotPassword(values),
    {
      loading: "Processing...",
      success: () => "Success! Check your email for OTP.",
      error: (err) =>
        err?.message || "Something went wrong. Please try again.",
    }
  );
};


  return (
    <div className={styles.mainDiv}>
       {/* <BackArrowIcon
        className={styles.backIcon}
        onClick={() => {
          navigate(-1);
        }} /> */}
      <p className={styles.heading}>Forgot Password</p>
      <p className={styles.subHeading}>Please Enter Email ID</p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles.form}
        autoComplete="off"
      >
        <FormControl
          name="identifier"
          register={register}
          controlType="input"
          label="Email ID"
          placeholder="Enter Email ID"
          validations={validations.identifier}
          errorMessage={errors?.identifier?.message}
          isRequired={true}
        />

        <Button type="submit" className= {combineClasses(styles.button, isValid && styles.activeButton)} disabled={isSubmitting || !isValid}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>

        <p className={styles.bottomText}>
          {" "}
          <Link
            className={combineClasses(styles.bottomText, "link-text")}
            to="/login"
          >
            Back to login?
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;
