import React, { useRef } from "react";
import styles from "./FileInput.module.scss";
import { Controller } from "react-hook-form";
import withLabelAndError from "../withLabelAndError";
import toast from "@/lib/toast";

const FileInput = (props) => {
  const {
    control,
    register,
    validations,
    name,
    placeholder = "Select files...",
    ...rest
  } = props;


  const inputRef = useRef(null);

  const renderInput = (field) => {
    const handleFileChange = (e) => {
      const files = Array.from(e.target.files);
      const accept = e.target.accept
        ?.split(",")
        .map((a) => a.trim().toLowerCase());

      const validFiles = [];
      const invalidFiles = [];

      files.forEach((file) => {
        const fileExt = "." + file.name.split(".").pop().toLowerCase();
        const mimeType = file.type.toLowerCase();

        const isValid = accept?.some((rule) => {
          if (rule.startsWith(".")) {
            return fileExt === rule;
          } else if (rule.endsWith("/*")) {
            const typeCategory = rule.split("/")[0];
            return mimeType.startsWith(typeCategory + "/");
          } else {
            return mimeType === rule;
          }
        });

        if (isValid) {
          validFiles.push(file);
        } else {
          invalidFiles.push(file.name);
        }
      });

      if (invalidFiles.length > 0) {
        toast.error(`These files are not allowed: ${invalidFiles.join(", ")}`);
      }

      field.onChange(validFiles);
    };

    const handleRemoveFile = (index) => {
      const newFiles = field.value.filter((_, i) => i !== index);
      field.onChange(newFiles);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    };

    return (
      <div className={styles.fileWrapper}>
        <input
          {...rest}
          type="file"
          id={name}
          name={name}
          ref={inputRef}
          className={styles.hiddenFileInput}
          onChange={handleFileChange}
        />

        <div className={`${styles.inputField} ${styles.chipInput}`}>
         {field.value && field.value.length > 0 ? (
  field.value.map((file, index) => {
    const isImage =
      (typeof file === "string" && /\.(jpeg|jpg|png|gif|webp)$/.test(file)) ||
      (typeof file !== "string" && file.type?.startsWith("image/"));

    const fileName =
      typeof file === "string"
        ? file.split("/").pop()
        : file.name;

    const imageUrl =
      typeof file === "string"
        ? file // backend URL
        : URL.createObjectURL(file); // local file preview

    return (
      <abbr key={index} title={fileName}>
        <span className={styles.fileChip}>
          {isImage ? (
            <img
              src={imageUrl}
              alt={fileName}
              className={styles.previewImage}
            />
          ) : (
            <p>{fileName}</p>
          )}
          <button
            type="button"
            onClick={() => handleRemoveFile(index)}
            className={styles.removeChip}
          >
            &times;
          </button>
        </span>
      </abbr>
    );
  })
) : (
  <span className={styles.placeholder}>{placeholder}</span>
)}

        </div>            
        <label htmlFor={name} className={styles.fileButton}>
          Select Files
        </label>
      </div>
    );
  };

  if (!register) {
    return (
      <Controller
        control={control}
        rules={validations}
        name={name}
        render={({ field }) => renderInput(field)}
      />
    );
  } else {
    const field = register(name, {
      ...validations,
      onChange: (e) => validations?.onChange?.(e) || Array.from(e.target.files),
    });
    return renderInput(field);
  }
};

const FileInputWithLabelAndError = withLabelAndError(FileInput);

export default FileInputWithLabelAndError;
export { FileInput };
