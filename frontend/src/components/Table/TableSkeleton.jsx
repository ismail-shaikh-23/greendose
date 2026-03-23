import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const TableSkeleton = ({ columns, sidebarOpen }) => {
  return (
    <div
      style={{
        width: !sidebarOpen ? "calc(100vw - 165px)" : "calc(100vw - 326px)",
        background: "white",
        display: "flex",
        flexDirection: "column",
        alignContent: "flex-start",
        maxHeight: "calc(100vh - 15.75rem)",
        overflow: "hidden",
      }}
    >
      <div>
        {Array(11)
          .fill(null)
          .map((_, i) => {
            return (
              <div
                key={i}
                style={{
                  padding: "0 16px",
                  height: "52px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  borderBottom: "1px solid rgba(241, 243, 249, 0.50)",
                  position: "relative",
                }}
              >
                {columns?.map((column) => (
                  <div
                    key={column.name}
                    style={{
                      width: column.width || "100px", // This gives base % or px width to the skeleton
                    }}
                  >
                    <Skeleton width="calc(100% - 1rem)" height="25px" />
                  </div>
                ))}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default TableSkeleton;
