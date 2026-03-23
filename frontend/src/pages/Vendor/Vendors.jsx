import React, { useCallback, useEffect } from "react";
import styles from "./Vendors.module.scss";
import CustomHeader from "@/components/CustomHeader/CustomHeader";
import Table from "@/components/Table/Table";
import { useDispatch, useSelector } from "react-redux";
import { getVendors } from "@/store/slices/vendorSlice";
import { setModalOpen } from "@/store/slices/globalSlice";
import { MODAL_ID, VENDOR_STATUS, VENDOR_TYPES } from "@/lib/constants";
import AddVendor from "./components/AddVendor/AddVendor";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal/ConfirmDeleteModal";
import VendorService from "@/services/api/vendor";
import toast from "react-hot-toast";
import { useSearchPagination } from "@/hooks/useSearchPagination";
import ActionsCell from "@/components/ActionCells/ActionsCell";
import { capitalizeText, conditionalColumns, updateParams } from "@/lib/utils";
import TabPanel from "@/components/TabPanel/TabPanel";
import { useSearchParams } from "react-router-dom";
import RejectionModal from "./components/RejectionModal/RejectionModal";
import Tooltip from "@/components/Tooltip/Tooltip";
import ShareModal from "@/components/ShareModal/ShareModal";

const tabNames = VENDOR_STATUS.map((status) => capitalizeText(status));

const Vendors = () => {
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
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab");

  const { isFetching, vendors, totalVendors } = useSelector(
    (state) => state.vendor
  );
  const { modalOpen } = useSelector((state) => state.global);

  const updateVendorStatus = (id, statusIndex) => async (reason) => {
    const payload = {
      status: VENDOR_STATUS[statusIndex],
    };
    if (reason && typeof reason === "string") {
      payload.rejectionReason = reason;
    }
    const data = await VendorService.updateVendorStatus(id, payload);
    if (data.success) {
      toast.success(data?.message || "Vendor status updated successfully");
      updateParams({ tab: statusIndex }, setParams);
    }
  };

  const actionsCellCallback = (row) => {
    const pendingActions = {
      onApprove: updateVendorStatus(row.id, 1),
      onReject: () => {
        dispatch(setModalOpen({ id: MODAL_ID.VENDOR_REJECTION, data: row.id }));
      },
    };
    return (
      <ActionsCell
        {...(tab === "0" ? pendingActions : {})}
        onEdit={() => {
          dispatch(setModalOpen({ id: MODAL_ID.ADD_VENDOR, data: row }));
        }}
      onDelete={() => {
  dispatch(setModalOpen({
    id: MODAL_ID.CONFIRM_DELETE,
    data: {
      id: row.id,
      userName: `"${row.organizationName}"`, 
    },
  }));
}}

      />
    );
  };

  const columns = [
    {
      name: "Organization Name",
      width: "150px",
      selector: (row) => row.organizationName,
    },
    {
      name: "Vendor Type",
      width: "150px",
      selector: (row) => capitalizeText(row.type),
    },
    {
      name: "License ID",
      width: "120px",
      selector: (row) => row.licenseId,
    },
    {
      name: "Zipcode",
      width: "140px",
      selector: (row) => row.addressZipcode,
    },
    {
      name: "Address",
      width: "250px",
      selector: (row) => {
        const address = row.addressName || "-";
        const addressStreet = row.addressStreet || "-";
        const state = row.addressState || "-";
        const city = row.addressCity || "-";
        const country = row.addressCountry || "-";
        const fullAddress = `${addressStreet} ${address} ${city}, ${state}, ${country}`;
        return (
          <Tooltip data={fullAddress} maxLength={40} id={`address -$row.id`}>
            {fullAddress}
          </Tooltip>
        );
      },
    },
    ...conditionalColumns(tab === "2", {
      name: "Rejection Reason",
      width: "180px",
      selector: (row) =>
        row.rejectionReason ? capitalizeText(row.rejectionReason) : "-",
    }),
    {
      name: "Status",
      width: "100px",
      selector: (row) => capitalizeText(row.status),
    },
    {
      name: "Action",
      width: "120px",
      cell: actionsCellCallback,
    },
  ];

  const getData = useCallback(() => {
    if (tab !== null) {
      dispatch(
        getVendors({
          search: debouncedSearch,
          page: pageSelected,
          limit: rowsPerPageValue,
          status: VENDOR_STATUS[tab],
        })
      );
    }
  }, [dispatch, debouncedSearch, pageSelected, rowsPerPageValue, tab]);

  const openAddVendorModal = () => {
    dispatch(setModalOpen({ id: MODAL_ID.ADD_VENDOR }));
  };
 


  const handleDelete = (id) => async () => {
    const data = await VendorService.deleteVendor(id);
    if (data) {
      getData();
      toast.success(data?.message || "Vendor added successfully");
      dispatch(setModalOpen(false));
    }
  };

 
const handleShareClick = async (vendor) => {
  try {
    const payload = {
      email: vendor.email, 
    };
    await VendorService.shareButton(payload);
    toast.success("Successfully sent email!");
  } catch (error) {
      console.error("Share API Error:", error);
    toast.error(error?.message || "Failed to sent email.");
  }
};

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <>
      <RejectionModal handleReject={updateVendorStatus(modalOpen?.data, 2)} />
      <AddVendor getData={getData} />
      <ConfirmDeleteModal
        handleDelete={handleDelete(modalOpen?.data?.id)}
        deleteLabel="vendor"
      />
      <div className={styles.main}>
        <div className={styles.vendors_head}>
          
          <div className={styles.vendors_customHeader}>
            <CustomHeader
              search={search}
              setSearch={setSearch}
              onButtonClick={openAddVendorModal}
              buttonLabel="Add"
              tabNames={tabNames}
             shareButton={true}
              
              sharebuttonLabel="Share"
              showTab={true}
            />
          </div>
          <ShareModal  handleShareClick={handleShareClick} />
        </div>
        <div>
          <Table
            columns={columns}
            data={vendors}
            className={styles.candidatesTable}
            progressPending={isFetching}
            paginationProps={{
              isPagination: true,
              tableName: "Accounts",
              pageSelected,
              totalCount: totalVendors,
              rowsPerPageValue,
              setRowsPerPageValue,
              setPageSelected,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Vendors;
