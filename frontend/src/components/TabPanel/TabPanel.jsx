import React, { useEffect } from "react";
import styles from "./TabPanel.module.scss";
import { combineClasses, updateParams } from "@/lib/utils";
import { useSearchParams } from "react-router-dom";

const TabPanel = ({ tabNames = [], className = "" }) => {
  const [params, setParams] = useSearchParams();

  const handleTabChange = (index) => {
    updateParams({ tab: index }, setParams);
  };

  useEffect(() => {
    if (params.get("tab") === null) {
      setTimeout(() => {
        handleTabChange(0);
      });
    }
    return () => {
      setParams((prev) => {
        prev.delete("tab");
        return prev;
      });
    };
    //eslint-disable-next-line
  }, []);

  return (
    <div className={combineClasses(styles.tabPanel, className)}>
      {tabNames.map((tab, index) => {
        return tab ? (
          <span
            key={tab}
            className={combineClasses(
              styles.tabName,
              params.get("tab") === index?.toString() ? styles.active : ""
            )}
            onClick={() => handleTabChange(index)}
          >
            {tab}
      
          </span>
        ) : (
          ""
        );
      })}
    </div>
  );
};

export default TabPanel;
