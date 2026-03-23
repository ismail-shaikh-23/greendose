import React, { useCallback, useEffect } from "react";
import styles from "./ExpiryAlertProducts.module.scss";
import CustomHeader from "@/components/CustomHeader/CustomHeader";
import Table from "@/components/Table/Table";
import { useDispatch, useSelector } from "react-redux";
import { setModalOpen } from "@/store/slices/globalSlice";
import { MODAL_ID } from "@/lib/constants";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal/ConfirmDeleteModal";
import ProductService from "@/services/api/product";
import toast from "react-hot-toast";
import { useSearchPagination } from "@/hooks/useSearchPagination";
import { getProduct } from "@/store/slices/productSlice";

import { addBaseUrl, dateConverter } from "@/lib/utils";

import ActionsCell from "@/components/ActionCells/ActionsCell";
import { getDashboardExpiryAlertData } from "@/store/slices/dashboardSlice";
import Tooltip from "@/components/Tooltip/Tooltip";
import DashboardTable from "@/pages/Dashboard/components/DashboardTable/DashboardTable";
import ExpiryAlertIcon from "@/components/SVGComponents/ExpiryAlertIcon";
const ExpiryAlertProducts = () => {

  const dispatch = useDispatch();

  const { isFetching, data } = useSelector((state) => state.dashboard);
  const products = data.expiryAlertProducts?.rows || [];






  const viewCellCallback = (row) => {
    const firstImagePath = row?.images?.[0]?.imageDetails?.path;
    if (!firstImagePath) return <span>No Image</span>;
    const imageUrl = addBaseUrl(firstImagePath.replace("public/", ""));

    return (
      <Tooltip id={`${row.id}-image`} data="View Image">
        <img
          src={imageUrl}
          alt="product"
          className={styles.imageIcon}
          onClick={() => {
            dispatch(setModalOpen({ id: MODAL_ID.VIEW_IMAGE, data: row }));
          }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/fallback_product_image.jpg";
          }}
        />
      </Tooltip>
    );
  };

  const columns = [
    {
      name: "Image",
      width: "70px",
      cell: viewCellCallback,
    },
    {
      name: "Product Name",
      width: "150px",
      cell: (row) => <Tooltip id={row.id} data={row.name} maxLength={18} />,
    },
    {
      name: "Category",
      width: "120px",
      selector: (row) => row.subCategory?.category?.name || "-",
    },
    {
      name: "Price (AED)",
      width: "100px",
      selector: (row) => row.price,
    },
    {
      name: "Quantity",
      width: "85px",
      selector: (row) => row.quantity,
    },
    {
      name: "Expiry Date",
      width: "120px",
      selector: (row) => (
        <span className={styles.expiryDateCell}>
          {" "}
          {dateConverter(row.expiryDate)}
        </span>
      ),
    },
  ];

  useEffect(() => {
    dispatch(getDashboardExpiryAlertData());
  }, [dispatch]);

  return (
    <div>
      <div className={styles.dashboardTableHead}>
        <ExpiryAlertIcon /> <h3> Expiry Alert Products</h3>
      </div>
      <div className={styles.main}>
        <DashboardTable
          columns={columns}
          data={products}
          className={styles.expiryTableWrapper}
          progressPending={isFetching}
        />
      </div>
    </div>
  );
};

export default ExpiryAlertProducts;
