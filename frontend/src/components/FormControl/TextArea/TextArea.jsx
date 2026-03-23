import React from "react";
import styles from "./TextArea.module.scss";
import { Controller } from "react-hook-form";
import withLabelAndError from "../withLabelAndError";

const TextArea = (props) => {
  const { control, register, validations, name, placeholder, type, ...rest } =
    props;

  const renderTextArea = (field = {}) => (
    <textarea
      {...field}
      {...rest}
      id={name}
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
        render={({ field }) => renderTextArea(field)}
      />
    );
  } else {
    const field = register && register(name, validations);
    return renderTextArea(field);
  }
};

const TextAreaWithLabelAndError = withLabelAndError(TextArea);

export default TextAreaWithLabelAndError;
export { TextArea };
