import React, { useCallback, useEffect } from "react";
import styles from "./Roles.module.scss";
import CustomHeader from "@/components/CustomHeader/CustomHeader";
import Table from "@/components/Table/Table";
import { useDispatch, useSelector } from "react-redux";
import { getRoles } from "@/store/slices/roleSlice";
import { setModalOpen } from "@/store/slices/globalSlice";
import { MODAL_ID } from "@/lib/constants";
import AddRole from "./components/AddRole/AddRole";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal/ConfirmDeleteModal";
import RoleService from "@/services/api/role";
import toast from "react-hot-toast";
import { useSearchPagination } from "@/hooks/useSearchPagination";
import { useNavigate } from "react-router-dom";
import ActionsCell from "@/components/ActionCells/ActionsCell";
import { checkPermission } from "@/lib/utils";

const Roles = () => {
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
  const navigate = useNavigate();

  const { isFetching, roles, totalRoles } = useSelector((state) => state.role);
  const { modalOpen } = useSelector((state) => state.global);

  const actionsCellCallback = (row) => (
    <ActionsCell
      onEdit={checkPermission("update role") && (() => {
        navigate(row.id.toString());
      })}
     onDelete={checkPermission("delete role") && (() => {
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

  const columns = [
    {
      name: "Role Name",
      width: "40%",
      selector: (row) => row.name,
    },
    {
      name: "Role Description",
      width: "50%",
      selector: (row) => row.description,
    },

    {
      name: "Action",
      width: "10%",
      cell: actionsCellCallback,
    },
  ];

  const getData = useCallback(() => {
    dispatch(
      getRoles({
        search: debouncedSearch,
        page: pageSelected,
        limit: rowsPerPageValue,
      })
    );
  }, [dispatch, debouncedSearch, pageSelected, rowsPerPageValue]);

  const openAddRoleModal = () => {
    dispatch(setModalOpen({ id: MODAL_ID.ADD_ROLE }));
  };

  const handleDelete = (id) => async () => {
    const data = await RoleService.deleteRole(id);
    if (data) {
      getData();
      toast.success(data?.message || "Role added successfully");
      dispatch(setModalOpen(false));
    }
  };

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <>
      <AddRole getData={getData} />
      <ConfirmDeleteModal
        handleDelete={handleDelete(modalOpen?.data?.id)}
        deleteLabel="role"
      />
      <div className={styles.main}>
        <CustomHeader
          search={search}
          setSearch={setSearch}
          onButtonClick={checkPermission("add role") && openAddRoleModal}
          buttonLabel="Add"
        />
        <Table
          columns={columns}
          data={roles}
          className={styles.candidatesTable}
          progressPending={isFetching}
          paginationProps={{
            isPagination: true,
            tableName: "Accounts",
            pageSelected,
            totalCount: totalRoles,
            rowsPerPageValue,
            setRowsPerPageValue,
            setPageSelected,
          }}
        />
      </div>
    </>
  );
};

export default Roles;
