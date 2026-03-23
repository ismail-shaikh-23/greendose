import ErrorText from "@/components/ErrorText/ErrorText";
import styles from "./InputWithLabelAndError.module.scss";
import { combineClasses } from "@/lib/utils";
import { useFormState } from "react-hook-form";

const withLabelAndError = (InputComponent) => {
  const InputWithLabelAndError = ({
    controlType,
    errorMessage,
    isRequired,
    ...props
  }) => {
    const { control, label, name } = props;
    //eslint-disable-next-line
    const { errors } = control ? useFormState({ control, name }) : {};

    const labelHtml = (
      <label className={styles.label} htmlFor={name}>
        {label}{" "}
        {isRequired ? <span className={styles.requiredMark}>*</span> : ""}
      </label>
    );

    const errorHtml = (
      <ErrorText className={styles.error}>{errors?.[name]?.message || errorMessage || ""}</ErrorText>
    );

    return controlType === "checkbox" ? (
      <div
        className={combineClasses(styles.inputControl, styles.checkboxControl)}
      >
        <div className={styles.checkboxContainer}>
          <InputComponent {...props} />
          {labelHtml}
        </div>
        {errorHtml}
      </div>
    ) : (
      <div
        className={combineClasses(
          styles.inputControl,
          controlType === "textarea" && styles.textareaControl
        )}
      >
        {labelHtml}
        <InputComponent {...props} />
        {errorHtml}
      </div>
    );
  };

  return InputWithLabelAndError;
};

export default withLabelAndError;
