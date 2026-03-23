import React from "react";
import styles from "./Checkbox.module.scss";
import { Controller } from "react-hook-form";
import { combineClasses } from "@/lib/utils";
import withLabelAndError from "../withLabelAndError";

const Checkbox = (props) => {
  const { control, register, validations, name, placeholder, ...rest } = props;

  const renderInput = (field = {}) => (
    <input
      type="checkbox"
      {...field}
      {...rest}
      id={name}
      className={combineClasses(styles.inputField, styles.checkbox)}
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

const CheckboxWithLabelAndError = withLabelAndError(Checkbox);

export default CheckboxWithLabelAndError;
export { Checkbox };
