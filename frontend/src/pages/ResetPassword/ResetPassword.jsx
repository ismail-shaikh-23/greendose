import React, { useEffect } from "react";
import styles from "./ResetPassword.module.scss";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "@/lib/toast";
import { passwordRegex } from "@/lib/regex";
import FormControl from "@/components/FormControl/FormControl";
import { useForm } from "react-hook-form";
import { requiredMessage } from "@/lib/utils";
import Button from "@/components/Button/Button";
import routes from "@/routes/routes";
import { VALIDATION_ERROR_MESSAGES } from "@/lib/constants";
import AuthService from "@/services/api/auth";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location?.state?.email;
  const initialValues = {
    password: "",
    confirmPassword: "",
  };

  const { control, handleSubmit, isSubmitting, getValues } = useForm({
    defaultValues: initialValues,
    mode: "onTouched",
  });

  const validations = {
    password: {
      required: requiredMessage("Password"),
      pattern: {
        value: passwordRegex,
        message: VALIDATION_ERROR_MESSAGES.PASSWORD_FORMAT,
      },
    },
    confirmPassword: {
      required: requiredMessage("Password"),
      validate: (value) =>
        value === getValues("password") || "Passwords don't match",
    },
  };
  const reset = (values) => {
    const payload = {
      email: email,
      newPassword: values.password,
      confirmPassword: values.confirmPassword,
    };

    return AuthService.reset(payload)
      .then((response) => {
        if (response?.error) {
          throw new Error(response.error);
        }
        navigate(routes.publicRoutes.LOGIN.path, {
          state: { email: email },
        });
      })
      .catch((error) => {
        throw new Error(
          error.response?.data?.message ||
            error?.message ||
            "Resetting password failed"
        );
      });
  };

  const onSubmit = async (values) => {
    const p = reset(values);
    await toast.promise(p, {
      loading: "Resetting password...",
      success: () => "Password Reset Successful",
      error: () => "Failed to Reset Password",
    });
  };

  useEffect(() => {
    if (!email) {
      toast.error("Email or User ID not found. Please try again.");
      return () => {
        navigate(routes.publicRoutes.FORGOT_PASSWORD.path);
      };
    }
  }, []);
  return (
    <div className={styles.mainDiv}>
      <p className={styles.heading}>Reset Password</p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles.form}
        autoComplete="off"
      >
        <FormControl
          name="password"
          control={control}
          controlType="password"
          label="Password"
          placeholder="Enter New Password"
          validations={validations.password}
          isRequired={true}
          maxLength={20}
        />
        <FormControl
          name="confirmPassword"
          control={control}
          controlType="password"
          label="Confirm Password"
          placeholder="Enter Confirm Password"
          validations={validations.confirmPassword}
          isRequired={true}
          maxLength={20}
        />
        <Button type="submit" className={styles.button} disabled={isSubmitting}>
          {isSubmitting ? "Resetting..." : "Reset"}
        </Button>
      </form>
    </div>
  );
};

export default ResetPassword;
