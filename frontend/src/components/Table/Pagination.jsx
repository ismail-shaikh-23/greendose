import React, { useMemo } from "react";
import styles from "./Table.module.scss";
import ReactPaginate from "react-paginate";
import { combineClasses } from "@/lib/utils";
import ArrowIcon from "../SVGComponents/ArrowIcon";
import { useSelector } from "react-redux";
import { PAGINATION } from "@/lib/constants";

const Pagination = (props) => {
  const {
    totalCount = 0,
    pageSelected,
    setPageSelected,
    rowsPerPageValue = PAGINATION.DEFAULT_ROWS_PER_PAGE,
  } = props;
  const { sidebarOpen } = useSelector((state) => state.global);
  const noOfPages = useMemo(
    () => Math.ceil(totalCount / rowsPerPageValue),
    [rowsPerPageValue, totalCount]
  );

  const endingData = useMemo(
    () => pageSelected * rowsPerPageValue,
    [pageSelected, rowsPerPageValue]
  );
  const startingData = useMemo(() => {
    if (pageSelected === 1) {
      return 1;
    } else if (endingData > totalCount) {
      return (noOfPages - 1) * rowsPerPageValue + 1;
    } else {
      return (pageSelected - 1) * rowsPerPageValue + 1;
    }
  }, [pageSelected, rowsPerPageValue, endingData, totalCount, noOfPages]);

  const handlePageClick = (e) => {
    setPageSelected(e?.selected + 1);
    props?.setPageSelected(e?.selected + 1);
  };

  return (
    <div
      className={combineClasses(
        styles.pagination,
        sidebarOpen && styles.sidebarOpen
      )}
    >
      {/* <p className={styles.dataRange}>
        {`${startingData} - ${endingData > totalCount ? totalCount : endingData} ${props?.tableName} out of ${totalCount}`}
      </p> */}
      <div className={styles.paginationRightSide}>
        <ReactPaginate
          breakLabel="..."
          breakClassName={styles.page}
          previousClassName={combineClasses(styles.page, styles.arrowBox)}
          previousLabel={
            <ArrowIcon
              className={combineClasses(styles.arrow, styles.previousArrow)}
            />
          }
          nextClassName={combineClasses(
            styles.page,
            styles.arrowBox,
            pageSelected === noOfPages ? styles.disabled : ""
          )}
          nextLabel={
            <ArrowIcon
              className={combineClasses(styles.arrow, styles.nextArrow)}
            />
          }
          renderOnZeroPageCount={null}
          pageCount={totalCount / rowsPerPageValue}
          containerClassName={styles.paginationContainer}
          activeClassName={styles.activePage}
          pageRangeDisplayed={2}
          marginPagesDisplayed={1}
          onPageChange={handlePageClick}
          disabledClassName={styles.disabled}
          pageClassName={styles.page}
          forcePage={pageSelected - 1}
        />
      </div>
    </div>
  );
};

export default Pagination;
