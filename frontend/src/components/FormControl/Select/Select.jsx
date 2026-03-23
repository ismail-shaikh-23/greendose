import React from "react";
import ReactSelect from "react-select";
import styles from "./Select.module.scss";
import withLabelAndError from "../withLabelAndError";
import { Controller } from "react-hook-form";
import { combineClasses } from "@/lib/utils";
import LoadingText from "@/components/LoadingText/LoadingText";

const Select = (props) => {
  const {
    control,
    validations,
    name,
    placeholder,
    isDisabled,
    options,
    optionsHeight,
    isMulti,
    className = "",
    loadingText = "Loading",
    isLoading = false,
    ...rest
  } = props;

  const loadingOption = {
    label: <LoadingText text={loadingText} style={{ fontWeight: "400" }} />,
    value: "loading",
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      background: "none",
      //   borderColor: '#9e9e9e',
      border: "none",
      minHeight: "28px",
      height: isMulti ? "maxContent" : "28px",
      boxShadow: null,
      overflow: isMulti ? "auto !important" : "hidden",
      cursor: "pointer",
    }),

    valueContainer: (provided) => ({
      ...provided,
      height: isMulti ? "maxContent" : "28px",
      padding: "0 8px",
      maxHeight: "50px",
      overflowY: "auto",
    }),

    menuList: (provided) => ({
      ...provided,
      maxHeight: optionsHeight || "100px",
    }),

    option: (provided) => ({
      ...provided,
      cursor: "pointer",
    }),

    input: (provided) => ({
      ...provided,
      margin: "0px",
      padding: "0",
      fontWeight: "600 !important",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: isMulti ? "maxContent" : "28px",
    }),
  };

  const renderInput = (field = {}) => (
    <ReactSelect
      {...rest}
      {...field}
      id={name}
      className={combineClasses(styles.inputField, className)}
      value={isLoading ? loadingOption : (field?.value ?? rest?.value)}
      options={isLoading ? [loadingOption] : options}
      styles={customStyles}
      placeholder={placeholder}
      classNamePrefix="react-select"
      isDisabled={isDisabled || isLoading}
      isMulti={isMulti}
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
    return renderInput();
  }
};

const SelectWithLabelAndError = withLabelAndError(Select);

export default SelectWithLabelAndError;
export { Select };
