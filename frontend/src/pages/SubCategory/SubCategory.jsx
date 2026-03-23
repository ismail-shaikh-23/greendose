import React, { useCallback, useEffect } from "react";
import styles from "./SubCategory.module.scss";
import CustomHeader from "@/components/CustomHeader/CustomHeader";
import Table from "@/components/Table/Table";
import { useDispatch, useSelector } from "react-redux";
import { getSubCategory } from "@/store/slices/subCategorySlice";
import { setModalOpen } from "@/store/slices/globalSlice";
import { MODAL_ID } from "@/lib/constants";
import AddSubCategory from "./components/AddSubCategory/AddSubCategory";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal/ConfirmDeleteModal";
import SubCategoryService from "@/services/api/subCategory";
import ViewImageModal from "@/components/ViewImage/ViewImage";
import toast from "react-hot-toast";
import { useSearchPagination } from "@/hooks/useSearchPagination";
import ActionsCell from "@/components/ActionCells/ActionsCell";
import { addBaseUrl, checkPermission } from "@/lib/utils";
import Tooltip from "@/components/Tooltip/Tooltip";

const SubCategorys = () => {
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

  const { isFetching, subCategory, totalSubCategory } = useSelector(
    (state) => state.subCategory
  );
  const { modalOpen } = useSelector((state) => state.global);

  const actionsCellCallback = (row) => (
    <ActionsCell
      onEdit={
        checkPermission("update single sub-category") &&
        (() => {
          dispatch(setModalOpen({ id: MODAL_ID.ADD_SUBCATEGORY, data: row }));
        })
      }
      onDelete={checkPermission("delete sub-category") &&(() => {
        dispatch(
            setModalOpen({
              id: MODAL_ID.CONFIRM_DELETE,
              data: {
                id: row.id,
                userName: `"${row.name}"`,
              },
            })
        );
      })}
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
      name: "Sub-Category",
      width: "30%",
      cell: (row) => {
        return (
          <Tooltip id={row?.id?.toString()} data={row?.name} maxLength={20} />
        );
      },
    },
    {
      name: "Category",
      width: "25%",
      selector: (row) => row?.category?.name,
    },

    {
      name: "Action",
       width: "20%",
      cell: actionsCellCallback,
    },
  ];

  const getData = useCallback(() => {
    dispatch(
      getSubCategory({
        search: debouncedSearch,
        page: pageSelected,
        limit: rowsPerPageValue,
      })
    );
  }, [dispatch, debouncedSearch, pageSelected, rowsPerPageValue]);

  const openAddSubCategoryModal = () => {
    dispatch(setModalOpen({ id: MODAL_ID.ADD_SUBCATEGORY }));
  };

  const handleDelete = (id) => async () => {
    const data = await SubCategoryService.deleteSubCategory(id);
    if (data) {
      getData();
      toast.success(data?.message || "SubCategory added successfully");
      dispatch(setModalOpen(false));
    }
  };

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <>
      <AddSubCategory getData={getData} />
      <ConfirmDeleteModal
        handleDelete={handleDelete(modalOpen?.data?.id)}
        deleteLabel="sub category"
      />
      <ViewImageModal />
      <div className={styles.main}>
        <CustomHeader
          search={search}
          setSearch={setSearch}
          onButtonClick={checkPermission("create single sub-category") && openAddSubCategoryModal}
          buttonLabel="Add"
        />
        <Table
          columns={columns}
          data={subCategory}
          className={styles.candidatesTable}
          progressPending={isFetching}
          paginationProps={{
            isPagination: true,
            tableName: "Sub Category",
            pageSelected,
            totalCount: totalSubCategory,
            rowsPerPageValue,
            setRowsPerPageValue,
            setPageSelected,
          }}
        />
      </div>
    </>
  );
};

export default SubCategorys;
