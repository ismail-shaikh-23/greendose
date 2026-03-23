import React from "react";
import styles from "./Range.module.scss";
import { Controller } from "react-hook-form";
import withLabelAndError from "../withLabelAndError";

const Range = (props) => {
  const { control, register, validations, name, placeholder, ...rest } = props;
  const { min, max } = rest;

  const renderRange = (field = {}) => {
    return (
      <div className={styles.rangeInput}>
        <input
          {...field}
          {...rest}
          id={name}
          type="range"
          className={styles.inputField}
          placeholder={placeholder}
        />
        <div className={styles.rangeLabel}>
          {Array.from({ length: max - min + 1 }, (_, i) => +min + i).map(
            (num) => (
              <span
                key={num}
                onClick={() => {
                  field.onChange({ target: { value: num, name } });
                }}
              >
                {num}
              </span>
            )
          )}
        </div>
      </div>
    );
  };

  if (control) {
    return (
      <Controller
        control={control}
        rules={validations}
        name={name}
        render={({ field }) => renderRange(field)}
      />
    );
  } else {
    const field = register && register(name, validations);
    return renderRange(field);
  }
};

const RangeWithLabelAndError = withLabelAndError(Range);

export default RangeWithLabelAndError;
export { Range };
