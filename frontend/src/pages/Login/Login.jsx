import React from "react";
import styles from "./Login.module.scss";
import { Link, useNavigate } from "react-router-dom";
import toast from "@/lib/toast";
import { emailRegex } from "@/lib/regex";
import FormControl from "@/components/FormControl/FormControl";
import { useForm } from "react-hook-form";
import { combineClasses, requiredMessage, saveToken } from "@/lib/utils";
import Button from "@/components/Button/Button";
import AuthService from "@/services/api/auth";
import { VALIDATION_ERROR_MESSAGES } from "@/lib/constants";
import loginLogo from "@/assets/png/login_logo.png";
import { useDispatch } from "react-redux";
import { setPermissions } from "@/store/slices/globalSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const initialValues = {
    email: "",
    password: "",
  };

  const {
    register,
    handleSubmit,
    formState: { isValid, isSubmitting, errors },
  } = useForm({
    defaultValues: initialValues,
    mode: "onTouched",
  });

  const validations = {
    email: {
      required: requiredMessage("Email ID"),
      pattern: {
        value: emailRegex,
        message: VALIDATION_ERROR_MESSAGES.EMAIL_FORMAT,
      },
    },
    password: {
      required: requiredMessage("Password"),
    },
  };

  const login = (values) => {
    const payload = {
      identifier: values.email,
      password: values.password,
    };
    return AuthService.login(payload)
      .then((response) => {
        if (response?.error) {
          throw new Error(response.error);
        }
        const permissions =
          response?.data?.permissions?.map?.((p) =>
            p?.actionName?.toLowerCase?.()
          ) || [];
        saveToken(response?.data?.token);
        dispatch(setPermissions(permissions));
        localStorage.setItem(
          "user",
          JSON.stringify({
            userId: response?.data?.userId,
            userName: response?.data?.userName,
            email: values.email,
            permissions,
          })
        );
        navigate("/");
      })
      .catch((error) => {
        throw new Error(
          error.response?.data?.error || error?.message || "Login failed"
        );
      });
  };

  const onSubmit = async (values) => {
    const p = login(values);
    await toast.promise(p, {
      loading: "Logging in...",
      success: () => "Login Successful",
      error: (err) => err?.message,
    });
  };

  return (
    <div className={styles.mainDiv}>
      <div className={styles.login_logo}>
        <img alt="logo" src={loginLogo} width={320} />{" "}
      </div>
      <p className={styles.heading}>Wellness for All Waste for None</p>
      <p className={styles.subHeading}>Sign in to your account</p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles.form}
        autoComplete="off"
      >
        <FormControl
          name="email"
          register={register}
          controlType="input"
          label="Email ID"
          placeholder="Enter Email ID"
          validations={validations.email}
          errorMessage={errors?.email?.message}
          isRequired={true}
        />
        <FormControl
          name="password"
          register={register}
          controlType="password"
          label="Password"
          placeholder="Enter Password"
          validations={validations.password}
          errorMessage={errors?.password?.message}
          isRequired={true}
        />
        <Link
          className={combineClasses(styles.bottomText, "link-text")}
          to="/forgot-password"
        >
          Forgot Password?
        </Link>
        <Button
          type="submit"
          className={combineClasses(
            styles.button,
            isValid && styles.activeButton
          )}
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? "Signning  in..." : "Sign in"}
        </Button>
        {/* <p className={styles.bottomText}>
              Don't have an account? <span 
                className="link-text" 
                onClick={() => navigate(PATH.publicRoutes.REGISTER.path)}
              >
                Sign up
              </span>
            </p> */}
      </form>
    </div>
  );
};

export default Login;
