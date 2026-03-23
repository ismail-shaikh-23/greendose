import React, { useMemo } from "react";
import styles from "./Button.module.scss";

const Button = ({ outlined, className, children, ...props }) => {
  const buttonClassName = useMemo(() => {
    if (outlined) {
      return styles.outlineButton;
    } else {
      return styles.primaryButton;
    }
  }, [outlined]);

  return (
    <button
      {...props}
      className={`${styles.button} ${className} ${buttonClassName}`}
    >
      {children}
    </button>
  );
};

export default Button;
