import React, { memo } from "react";
import DataTable from "react-data-table-component";
import Pagination from "./Pagination";
import styles from "./Table.module.scss";
import { combineClasses } from "@/lib/utils";
import TableSkeleton from "./TableSkeleton";
import { useSelector } from "react-redux";

const Table = (props) => {
  const { sidebarOpen } = useSelector((state) => state.global);
  return (
    <div
      style={{
        display: "flex",
        overflow: "auto !important",
        width: sidebarOpen
          ? "calc(100vw - 165px) !important"
          : "calc(100vw - 326px) !important",
      }}
    >
      <DataTable
        {...props}
        pagination={false}
        noDataComponent={
          <p className={styles.noData}>There are no records to display</p>
        }
        columns={props?.columns}
        className={combineClasses(
          "scrollable",
          styles.table,
          sidebarOpen ? styles.sidebarOpen : "",
          props.className || ""
        )}
        progressComponent={
          <TableSkeleton columns={props.columns} sidebarOpen={sidebarOpen} />
        }
        // progressComponent={<CircleSpinner />}
        fixedHeader={true}
        // fixedHeaderScrollHeight='auto'
        responsive
      />
      {/* <TableSkeleton columns={props.columns}/> */}
      {props?.paginationProps?.isPagination && (
        <Pagination {...props?.paginationProps} />
      )}
    </div>
  );
};

export default memo(Table);
