import React, { useCallback, useEffect } from "react";
import styles from "./Offers.module.scss";
import CustomHeader from "@/components/CustomHeader/CustomHeader";
import Table from "@/components/Table/Table";
import { useDispatch, useSelector } from "react-redux";
import { getOffers } from "@/store/slices/offerSlice";
import { setModalOpen } from "@/store/slices/globalSlice";
import { MODAL_ID } from "@/lib/constants";
import AddOffer from "./components/AddOffer/AddOffer";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal/ConfirmDeleteModal";
import OfferService from "@/services/api/offer";
import toast from "react-hot-toast";
import { useSearchPagination } from "@/hooks/useSearchPagination";
import ActionsCell from "@/components/ActionCells/ActionsCell";
import { addBaseUrl, checkPermission, dateConverter } from "@/lib/utils";

const Offers = () => {
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

  const { isFetching, offers, totalOffers } = useSelector(
    (state) => state.offer
  );
  const { modalOpen } = useSelector((state) => state.global);

  const actionsCellCallback = (row) => (
    <ActionsCell
      onEdit={checkPermission("update user") && (() => {
        dispatch(setModalOpen({ id: MODAL_ID.ADD_OFFER, data: row }));
      })}
     onDelete={checkPermission("delete user") && (() => {
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
   const firstImagePath = row?.imagePath;
console.log("row.images", row.imagePath);


    if (!firstImagePath) return <span>No Image</span>;
    const imageUrl = addBaseUrl(firstImagePath.replace("public/", ""));
console.log("imageUrl", imageUrl);
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
      name: "Images",
      width: "10%",
      cell: viewCellCallback,
    },
    {
      name: "Offer Name",
      width: "25%",
      selector: (row) => row.name,
    },
    {
      name: "Offer Type",
      width: "10%",
      selector: (row) => row.type,
    },
    {
      name: "Discount Type",
       width: "15%",
      selector: (row) => row.discountType,
    },
    {
      name: "Discount Value",
     width: "10%",  
      selector: (row) => row.discountValue,
    },
    {
      name: "Start Date",
        width: "15%",
      selector: (row) => (row.startDate ? dateConverter(row?.startDate) : "-"),
    },
    {
      name: "End Date",
        width: "15%",
   
      selector: (row) => (row.endDate ? dateConverter(row?.endDate) : "-"),
    },
    {
      name: "Action",
      width: "150px",
      cell: actionsCellCallback,
    },
  ];

  const getData = useCallback(() => {
    dispatch(
      getOffers({
        search: debouncedSearch,
        page: pageSelected,
        limit: rowsPerPageValue,
      })
    );
  }, [dispatch, debouncedSearch, pageSelected, rowsPerPageValue]);

  const openAddOfferModal = () => {
    dispatch(setModalOpen({ id: MODAL_ID.ADD_OFFER }));
  };

  const handleDelete = (id) => async () => {
    const data = await OfferService.deleteOffer(id);
    if (data) {
      getData();
      toast.success(data?.message || "Offer added successfully");
      dispatch(setModalOpen(false));
    }
  };

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <>
      <AddOffer getData={getData} />
      <ConfirmDeleteModal
        handleDelete={handleDelete(modalOpen?.data)}
        deleteLabel="offer"
      />
      <div className={styles.main}>
        <CustomHeader
          search={search}
          setSearch={setSearch}
          onButtonClick={checkPermission("add user") && openAddOfferModal}
          buttonLabel="Add"
        />
        <Table
          columns={columns}
          data={offers}
          className={styles.candidatesTable}
          progressPending={isFetching}
          paginationProps={{
            isPagination: true,
            tableName: "Accounts",
            pageSelected,
            totalCount: totalOffers,
            rowsPerPageValue,
            setRowsPerPageValue,
            setPageSelected,
          }}
        />
      </div>
    </>
  );
};

export default Offers;
