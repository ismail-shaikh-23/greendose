import React, { memo } from "react";
import DataTable from "react-data-table-component";

import styles from "./DashboardTable.module.scss";
import { combineClasses } from "@/lib/utils";
import { useSelector } from "react-redux";

const DashboardTable = (props) => {
  const { sidebarOpen } = useSelector((state) => state.global);
  return (
    <div
      className={combineClasses(
        styles.dashboardtable,
        sidebarOpen ? styles.sidebarOpen : "",
        props.className || ""
      )}
    >
      <DataTable
        data={props.data}
        columns={props?.columns}
        pagination={false}
        noDataComponent={
          <p className={styles.noData}>There are no records to display</p>
        }
        fixedHeader={true}
        responsive
        {...props}
      />
    </div>
  );
};

export default memo(DashboardTable);
