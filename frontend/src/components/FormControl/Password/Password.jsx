import React from "react";
import styles from "./Password.module.scss";
import { Controller } from "react-hook-form";
import withLabelAndError from "../withLabelAndError";
import Eye from "@/components/SVGComponents/Eye";
import EyeSlash from "@/components/SVGComponents/EyeSlash";

const Password = (props) => {
  const { control, register, validations, name, placeholder, ...rest } = props;

  const [showPassword, setShowPassword] = React.useState(false);
  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const renderInput = (field = {}) => {
    return (
      <>
        <input
          {...field}
          {...rest}
          id={name}
          type={showPassword ? "text" : "password"}
          className={styles.inputField}
          placeholder={placeholder}
        />
        {showPassword ? (
          <EyeSlash onClick={toggleShowPassword} className={styles.eyeIcon} />
        ) : (
          <Eye onClick={toggleShowPassword} className={styles.eyeIcon} />
        )}
      </>
    );
  };

  if (control) {
    return (
      <Controller
        control={control}
        rules={validations}
        name={name}
        render={({ field }) => renderInput(field)}
      />
    );
  } else {
    const field = register && register(name, validations);
    return renderInput(field);
  }
};

const PasswordWithLabelAndError = withLabelAndError(Password);

export default PasswordWithLabelAndError;
export { Password };
