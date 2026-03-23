import React, { useEffect, useRef } from "react";
import { useFieldArray } from "react-hook-form";
import styles from "./FieldArray.module.scss";
import Button from "@/components/Button/Button";
import DeleteIcon from "@/components/SVGComponents/DeleteIcon";
import { Input } from "../Input/Input";
import withLabelAndError from "../withLabelAndError";
import { capitalizeText, getInitialValues } from "@/lib/utils";

let updated = false;

const FieldArray = (props) => {
  const { control, name, arrayFields } = props;
  const capsName = capitalizeText(name).slice(0, -1);
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  const inputRef = useRef();

  const addFields = () => {
    updated = true;
    append(getInitialValues(arrayFields));
  };

  const handleRemove = (index) => () => {
    updated = true;
    remove(index);
  };

  useEffect(() => {
    if (inputRef?.current && updated) {
      inputRef?.current?.focus?.();
    }
  }, [fields]);

  useEffect(() => {
    return () => {
      updated = false;
    };
  }, []);

  return (
    <div className={styles.fieldArrayWrapper}>
      {fields.map((item, index) => {
        const lastSlab = index === fields.length - 1;
        return (
          <div key={item.id} className={styles.slabRow}>
            <div className={styles.heading}>
              <p>
                {capsName} {index + 1}
              </p>
              {lastSlab && (
                <DeleteIcon onClick={handleRemove(index)} height={16} />
              )}
            </div>
            <div className={styles.fields}>
              {Object.entries(arrayFields).map(
                ([fieldName, fieldProps], slabFieldIndex) => {
                  return (
                    <Input
                      key={fieldName}
                      {...(lastSlab && slabFieldIndex === 0
                        ? { ref: inputRef }
                        : {})}
                      name={`${name}[${index}][${fieldName}]`}
                      control={control}
                      type={fieldProps.controlType}
                      placeholder={
                        fieldProps?.placeholder || `Enter ${fieldProps.label}`
                      }
                    />
                  );
                }
              )}
            </div>
          </div>
        );
      })}
      <Button type="button" onClick={addFields} className={styles.addBtn}>
        Add {capsName}
      </Button>
    </div>
  );
};

const FieldArrayWithLabelAndError = withLabelAndError(FieldArray);

export default FieldArrayWithLabelAndError;
export { FieldArray };
