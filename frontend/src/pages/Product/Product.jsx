import React, { useCallback, useEffect } from "react";
import styles from "./Product.module.scss";
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
import AddProduct from "./components/AddProduct/AddProduct";
import { addBaseUrl, checkPermission, dateConverter } from "@/lib/utils";
import ViewImageModal from "@/components/ViewImage/ViewImage";
import ActionsCell from "@/components/ActionCells/ActionsCell";
// import ViewOffers from "./components/ViewOffers/ViewOffers";
import Tooltip from "@/components/Tooltip/Tooltip";

const Product = () => {
  const {
    debouncedSearch,
    search,
    setSearch,
    pageSelected,
    setPageSelected,
    rowsPerPageValue,
    setRowsPerPageValue,
  } = useSearchPagination();

  const dispatch = useDispatch();

  const { isFetching, products, totalProducts } = useSelector(
    (state) => state.product
  );
  const { modalOpen } = useSelector((state) => state.global);

  const actionsCellCallback = (row) => (
    <ActionsCell
      onEdit={checkPermission("update product") && (() => {
        dispatch(setModalOpen({ id: MODAL_ID.ADD_PRODUCT, data: row }));
      })}
    onDelete={checkPermission("delete Product") && (() => {
  dispatch(setModalOpen({
    id: MODAL_ID.CONFIRM_DELETE,
    data: {
      id: row.id,
      userName: `"${row.name}"`, 
    },
  }));
})}

    />
  );
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
      name: "Images",
      width: "110px",
      cell: viewCellCallback,
    },
    {
      name: "Product Name",
      width: "180px",
      cell: (row) => <Tooltip id={row?.name} data={row?.name} maxLength={20} />,
    },
    {
      name: "Price",
      width: "130px",
      selector: (row) => row.price,
    },
    {
      name: "Expiry Date",
      width: "150px",
      selector: (row) => dateConverter(row.expiryDate),
    },
    {
      name: "Quantity",
      width: "130px",
      selector: (row) => row.quantity,
    },
    {
      name: "Brand",
      width: "170px",
      // selector: (row) => row.brand,
      cell: (row) => (
        <Tooltip id={row?.name} data={row?.brand} maxLength={20} />
      ),
    },
    {
      name: "Tags",
      width: "160px",
      cell: (row) =>
        (
          <Tooltip
            id={row?.id?.toString()}
            data={row?.tags?.join(", ")}
            maxLength={20}
          />
        ) || "-",
    },
    {
      name: "Action",
      width: "75px",
      cell: actionsCellCallback,
    },
  ];

  const getData = useCallback(() => {
    dispatch(
      getProduct({
        search: debouncedSearch,
        page: pageSelected,
        limit: rowsPerPageValue,
      })
    );
  }, [dispatch, debouncedSearch, pageSelected, rowsPerPageValue]);

  const openAddProductModal = () => {
    dispatch(setModalOpen({ id: MODAL_ID.ADD_PRODUCT }));
  };

  const handleDelete = (id) => async () => {
    const data = await ProductService.deleteProduct(id);
    if (data) {
      getData();
      toast.success(data?.message || "Product added successfully");
      dispatch(setModalOpen(false));
    }
  };

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <>
      <AddProduct getData={getData} />
      <ConfirmDeleteModal
        handleDelete={handleDelete(modalOpen?.data?.id)}
        deleteLabel="product"
      />
      <ViewImageModal />
      {/* <ViewOffers />   */}
      <div className={styles.main}>
        <CustomHeader
          search={search}
          setSearch={setSearch}
          onButtonClick={checkPermission("add product") &&  openAddProductModal}
          buttonLabel="Add"
        />
        <Table
          columns={columns}
          data={products}
          className={styles.candidatesTable}
          progressPending={isFetching}
          paginationProps={{
            isPagination: true,
            tableName: "Product",
            pageSelected,
            totalCount: totalProducts,
            rowsPerPageValue,
            setRowsPerPageValue,
            setPageSelected,
          }}
        />
      </div>
    </>
  );
};

export default Product;
