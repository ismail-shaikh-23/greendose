import React, { useCallback, useEffect } from "react";
import styles from "./Users.module.scss";
import CustomHeader from "@/components/CustomHeader/CustomHeader";
import Table from "@/components/Table/Table";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "@/store/slices/userSlice";
import { setModalOpen } from "@/store/slices/globalSlice";
import { MODAL_ID } from "@/lib/constants";
import AddUser from "./components/AddUser/AddUser";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal/ConfirmDeleteModal";
import UserService from "@/services/api/user";
import toast from "react-hot-toast";
import { useSearchPagination } from "@/hooks/useSearchPagination";
import ActionsCell from "@/components/ActionCells/ActionsCell";
import Tooltip from "@/components/Tooltip/Tooltip";
import { checkPermission } from "@/lib/utils";

const Users = () => {
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

  const { isFetching, users, totalUsers } = useSelector((state) => state.user);
  const { modalOpen } = useSelector((state) => state.global);

  const actionsCellCallback = (row) => (
    <ActionsCell
      onEdit={
        checkPermission("update user") &&
        (() => {
          dispatch(setModalOpen({ id: MODAL_ID.ADD_USER, data: row }));
        })
      }
      onDelete={
        checkPermission("delete user") &&
        (() => {
          dispatch(
            setModalOpen({
              id: MODAL_ID.CONFIRM_DELETE,
              data: {
                id: row.id,
                userName: `"${row.firstName} ${row.lastName}"`,
              },
            })
          );
        })
      }
    />
  );

  const columns = [
    {
      name: "Name",
      width: "160px",
      selector: (row) => `${row.firstName} ${row.lastName}`,
    },
    {
      name: "User Name",
      width: "160px",
      selector: (row) => `${row.userName} `,
    },
    {
      name: "Email",
      width: "280px",
      selector: (row) => row.email,
      cell: (row) => (
        <Tooltip id={row?.email} data={row?.email || "abc"} maxLength={35} />
      ),
    },
    {
      name: "Mobile Number",
      width: "140px",
      selector: (row) => row.mobileNumber,
    },
    {
      name: "Status",
      width: "180px",
      selector: (row) => (
        <span className={row.isActive ? "status-active" : "status-inactive"}>
          {row.isActive ? "Active" : "In-Active"}
        </span>
      ),
    },
    {
      name: "Action",
      width: "100px",
      cell: actionsCellCallback,
    },
  ];

  const getData = useCallback(() => {
    dispatch(
      getUsers({
        search: debouncedSearch,
        page: pageSelected,
        limit: rowsPerPageValue,
      })
    );
  }, [dispatch, debouncedSearch, pageSelected, rowsPerPageValue]);

  const openAddUserModal = () => {
    dispatch(setModalOpen({ id: MODAL_ID.ADD_USER }));
  };

  const handleDelete = (id) => async () => {
    const data = await UserService.deleteUser(id);
    if (data) {
      getData();
      toast.success(data?.message || "User added successfully");
      dispatch(setModalOpen(false));
    }
  };

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <>
      <AddUser getData={getData} />
      <ConfirmDeleteModal
        handleDelete={handleDelete(modalOpen?.data?.id)}
        deleteLabel="user"
      />
      <div className={styles.main}>
        <CustomHeader
          search={search}
          setSearch={setSearch}
          onButtonClick={checkPermission("add user") && openAddUserModal}
          buttonLabel="Add"
        />
        <Table
          columns={columns}
          data={users}
          className={styles.candidatesTable}
          progressPending={isFetching}
          paginationProps={{
            isPagination: true,
            tableName: "Accounts",
            pageSelected,
            totalCount: totalUsers,
            rowsPerPageValue,
            setRowsPerPageValue,
            setPageSelected,
          }}
        />
      </div>
    </>
  );
};

export default Users;
