import React from "react";
import styles from "./DashboardHeaderComponent.module.scss";
import SearchIcon from "../SVGComponents/SearchIcon";
import { getCurrentUser } from "@/lib/utils";

const DashboardHeaderComponent = ({ title, searchValue, onSearchChange }) => {
  return (
    <div className={styles.headerWrapper}>
      <div className={styles.innerHeader}>
        <h6 className={styles.upper_title}> Welcome to Dashboard </h6>
        <h2 className={styles.title}>
          Hello {getCurrentUser("userName") || ""}
        </h2>
      </div>
      {/* <div className={styles.rightSection}>
        <SearchIcon className={styles.searchIcon} />

        <input
          type="text"
          placeholder="Type here..."
          value={searchValue}
          onChange={onSearchChange}
          className={styles.searchInput}
        />

        <BellIcon className={styles.bellIcon} />
      </div> */}
    </div>
  );
};

export default DashboardHeaderComponent;
