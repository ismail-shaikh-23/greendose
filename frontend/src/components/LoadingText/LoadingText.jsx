import React from "react";
import styles from "./LoadingText.module.scss";
import { combineClasses } from "@/lib/utils";

const LoadingText = ({ text, className = "", style }) => {
  return (
    <span
      className={combineClasses(styles.loadingText, className)}
      style={style}
    >
      {text}
      <span className={styles.dotOne}>.</span>
      <span className={styles.dotTwo}>.</span>
      <span className={styles.dotThree}>.</span>
    </span>
  );
};

export default LoadingText;
