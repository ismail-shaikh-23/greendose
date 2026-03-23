import React, { useCallback, useEffect } from "react";
import styles from "./Permissions.module.scss";
import CustomHeader from "@/components/CustomHeader/CustomHeader";
import Table from "@/components/Table/Table";
import { useDispatch, useSelector } from "react-redux";
import { getPermissions } from "@/store/slices/permissionSlice";
import { setModalOpen } from "@/store/slices/globalSlice";
import { MODAL_ID } from "@/lib/constants";
import AddPermission from "./components/AddPermission/AddPermission";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal/ConfirmDeleteModal";
import PermissionService from "@/services/api/permission";
import toast from "react-hot-toast";
import { useSearchPagination } from "@/hooks/useSearchPagination";
import ActionsCell from "@/components/ActionCells/ActionsCell";
import { checkPermission } from "@/lib/utils";

const Permissions = () => {
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

  const { isFetching, permissions, totalPermissions } = useSelector(
    (state) => state.permission
  );
  const { modalOpen } = useSelector((state) => state.global);

  const actionsCellCallback = (row) => (
    <ActionsCell
      onEdit={checkPermission("update permission") && (() => {
        dispatch(setModalOpen({ id: MODAL_ID.ADD_PERMISSION, data: row }));
      })}
    onDelete={checkPermission("delete permission") && (() => {
  dispatch(setModalOpen({
    id: MODAL_ID.CONFIRM_DELETE,
    data: {
      id: row.id,
    userName: `"${row.actionName}"`, 
    },
  }));
})}

    />
  );

  const columns = [
    {
      name: "Permission Name",
      width: "200px",
      selector: (row) => row.actionName,
    },
    {
      name: "Permisssion Description",
      width: "250px",
      selector: (row) => row.description,
    },
    {
      name: "Method",
      width: "200px",
      selector: (row) => row.method,
    },
    {
      name: "Base URL",
      width: "150px",
      selector: (row) => row.baseUrl,
    },
     {
      name: "Path",
      width: "150px",
      selector: (row) => row.path,
    },
    {
      name: "Action",
      width: "75px",
      cell: actionsCellCallback,
    },
  ];

  const getData = useCallback(() => {
    dispatch(
      getPermissions({
        search: debouncedSearch,
        page: pageSelected,
        limit: rowsPerPageValue,
      })
    );
  }, [dispatch, debouncedSearch, pageSelected, rowsPerPageValue]);

  const openAddPermissionModal = () => {
    dispatch(setModalOpen({ id: MODAL_ID.ADD_PERMISSION }));
  };

  const handleDelete = (id) => async () => {
    const data = await PermissionService.deletePermission(id);
    if (data) {
      getData();
      toast.success(data?.message || "Permission added successfully");
      dispatch(setModalOpen(false));
    }
  };

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <>
      <AddPermission getData={getData} />
      <ConfirmDeleteModal
        handleDelete={handleDelete(modalOpen?.data?.id)}
        deleteLabel="permission"
      />
      <div className={styles.main}>
        <CustomHeader
          search={search}
          setSearch={setSearch}
          onButtonClick={checkPermission("add permission") && openAddPermissionModal}
          buttonLabel="Add"
        />
        <Table
          columns={columns}
          data={permissions}
          className={styles.candidatesTable}
          progressPending={isFetching}
          paginationProps={{
            isPagination: true,
            tableName: "Accounts",
            pageSelected,
            totalCount: totalPermissions,
            rowsPerPageValue,
            setRowsPerPageValue,
            setPageSelected,
          }}
        />
      </div>
    </>
  );
};

export default Permissions;
