import React from "react";
import styles from "./Input.module.scss";
import { Controller } from "react-hook-form";
import withLabelAndError from "../withLabelAndError";

const Input = (props) => {
  const { control, register, validations, name, placeholder, type, ...rest } =
    props;

  const renderInput = (field = {}) => (
    <input
      {...field}
      {...rest}
      id={name}
      type={type || "text"}
      className={styles.inputField}
      placeholder={placeholder}
    />
  );

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

const InputWithLabelAndError = withLabelAndError(Input);

export default InputWithLabelAndError;
export { Input };
