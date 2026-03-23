import React, { useCallback, useEffect } from "react";
import styles from "./Category.module.scss";
import CustomHeader from "@/components/CustomHeader/CustomHeader";
import Table from "@/components/Table/Table";
import { useDispatch, useSelector } from "react-redux";
import { getCategory } from "@/store/slices/categorySlice";
import { setModalOpen } from "@/store/slices/globalSlice";
import { MODAL_ID } from "@/lib/constants";
import AddCategory from "./components/AddCategory/AddCategory";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal/ConfirmDeleteModal";
import ViewImageModal from "@/components/ViewImage/ViewImage";
import CategoryService from "@/services/api/category";
import toast from "react-hot-toast";
import { useSearchPagination } from "@/hooks/useSearchPagination";
import ActionsCell from "@/components/ActionCells/ActionsCell";
import { addBaseUrl, checkPermission } from "@/lib/utils";
import Tooltip from "@/components/Tooltip/Tooltip";

const Category = () => {
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

  const { isFetching, categories, totalCategory } = useSelector(
    (state) => state.category
  );
  const { modalOpen } = useSelector((state) => state.global);

  const actionsCellCallback = (row) => (
    <ActionsCell
      onEdit={
        checkPermission("update category") &&
        (() => {
          dispatch(setModalOpen({ id: MODAL_ID.ADD_CATEGORY, data: row }));
        })
      }
      onDelete={
        checkPermission("delete category") &&
        (() => {
          dispatch(
            setModalOpen({
              id: MODAL_ID.CONFIRM_DELETE,
              data: {
                id: row.id,
                userName: `"${row.name}"`,
              },
            })
          );
        })
      }
    />
  );
  const viewCellCallback = (row) => {
    const firstImagePath = row?.images?.[0]?.imageDetails?.path;
    if (!firstImagePath) return <span>No Image</span>;
    const imageUrl = addBaseUrl(firstImagePath.replace("public/", ""));
    return (
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
    );
  };
  const columns = [
    {
      name: "Image",
      width: "20%",
      cell: viewCellCallback,
    },
    {
      name: "Category",
      width: "25%",
      selector: (row) => row.name,
    },
    {
      name: "Sub-Category",
     width: "30%",
      cell: (row) =>
        row?.subCategory?.length > 0 ? (
          <Tooltip
            id={row?.name}
            data={row?.subCategory.map((sub) => sub.name).join(", ")}
            maxLength={50}
          />
        ) : (
          "-"
        ),
    },

    {
      name: "Action",
        width: "25%",
      cell: actionsCellCallback,
    },
  ];

  const getData = useCallback(() => {
    dispatch(
      getCategory({
        search: debouncedSearch,
        page: pageSelected,
        limit: rowsPerPageValue,
      })
    );
  }, [dispatch, debouncedSearch, pageSelected, rowsPerPageValue]);

  const openAddCategoryModal = () => {
    dispatch(setModalOpen({ id: MODAL_ID.ADD_CATEGORY }));
  };

  const handleDelete = (id) => async () => {
    const data = await CategoryService.deleteCategory(id);
    if (data) {
      getData();
      toast.success(data?.message || "Category deleted successfully");
      dispatch(setModalOpen(false));
    }
  };

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <>
      <AddCategory getData={getData} />
      <ConfirmDeleteModal
        handleDelete={handleDelete(modalOpen?.data?.id)}
        deleteLabel="category"
      />
      <ViewImageModal />
      <div className={styles.main}>
        <CustomHeader
          search={search}
          setSearch={setSearch}
          onButtonClick={checkPermission("add category list") &&openAddCategoryModal}
          buttonLabel="Add"
        />
        <Table
          columns={columns}
          data={categories}
          className={styles.candidatesTable}
          progressPending={isFetching}
          paginationProps={{
            isPagination: true,
            tableName: "Category",
            pageSelected,
            totalCount: totalCategory,
            rowsPerPageValue,
            setRowsPerPageValue,
            setPageSelected,
          }}
        />
      </div>
    </>
  );
};

export default Category;
