import React, { useCallback, useEffect } from "react";
import styles from "./Campaign.module.scss";
import CustomHeader from "@/components/CustomHeader/CustomHeader";
import Table from "@/components/Table/Table";
import { useDispatch, useSelector } from "react-redux";
import { getCampaign } from "@/store/slices/campaignSlice";
import { setModalOpen } from "@/store/slices/globalSlice";
import { MODAL_ID } from "@/lib/constants";
import AddCampaign from "./components/AddCampaign/AddCampaign";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal/ConfirmDeleteModal";

import CampaignService from "@/services/api/campaign";
import toast from "react-hot-toast";
import { useSearchPagination } from "@/hooks/useSearchPagination";
import ActionsCell from "@/components/ActionCells/ActionsCell";
import { Tooltip } from "react-tooltip";
import { addBaseUrl } from "@/lib/utils";
import ViewOffers from "@/components/ViewOffers/ViewOffers";

const Campaign = () => {
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

  const { isFetching, categories, totalCampaign } = useSelector(
    (state) => state.campaign
  );
  const { modalOpen } = useSelector((state) => state.global);

    const viewOfferCellCallback = (row) => {
    return (
      <ActionsCell
        onText={() => {
          dispatch(
            setModalOpen({
              id: MODAL_ID.VIEW_OFFERS,
              data: {
                // allApplicableOffers: row.allApplicableOffers,
                // name: row.name,
                campaignOffers : row.campaignOffers
              },
            })
          );
        }}
      />
    )}

  const actionsCellCallback = (row) => (
    <ActionsCell
      onEdit={() => {
        dispatch(setModalOpen({ id: MODAL_ID.ADD_CAMPAIGN, data: row }));
      }}
     onDelete={() => {
  dispatch(setModalOpen({
    id: MODAL_ID.CONFIRM_DELETE,
    data: {
      id: row.id,
      userName: `"${row.name}"`, 
    },
  }));
}}

    />
  );

   const viewCellCallback = (row) => {
     const firstImagePath = row?.imageDetails?.path;
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
        width: "15%",
       cell: viewCellCallback,
     },
     {
       name: "Campaign",
      width: "20%",
       selector: (row) => row.name,
     },

     {
       name: "Start Date",
        width: "15%",
       selector: (row) =>
         row.startDate ? new Date(row.startDate).toLocaleDateString() : "-",
     },
     {
       name: "End Date",
      width: "15%",
       selector: (row) =>
         row.endDate ? new Date(row.endDate).toLocaleDateString() : "-",
     },
     {
       name: "Offers",
       width: "20%",  
       cell: viewOfferCellCallback,
     },
     {
       name: "Action",
        width: "15%",
       cell: actionsCellCallback,
     },
   ];

   const getData = useCallback(() => {
     dispatch(
       getCampaign({
         search: debouncedSearch,
         page: pageSelected,
         limit: rowsPerPageValue,
       })
     );
   }, [dispatch, debouncedSearch, pageSelected, rowsPerPageValue]);

   const openAddCampaignModal = () => {
     dispatch(setModalOpen({ id: MODAL_ID.ADD_CAMPAIGN }));
   };

   const handleDelete = (id) => async () => {
     const data = await CampaignService.deleteCampaign(id);
     if (data) {
       getData();
       toast.success(data?.message || "Campaign deleted successfully");
       dispatch(setModalOpen(false));
     }
   };

   useEffect(() => {
     getData();
   }, [getData]);

   return (
     <>
       <AddCampaign getData={getData} />
       <ConfirmDeleteModal
         handleDelete={handleDelete(modalOpen?.data?.id)}
         deleteLabel="campaign"
       />
       <ViewOffers />

       <div className={styles.main}>
         <CustomHeader
           search={search}
           setSearch={setSearch}
           onButtonClick={openAddCampaignModal}
           buttonLabel="Add"
         />
         <Table
           columns={columns}
           data={categories}
           className={styles.candidatesTable}
           progressPending={isFetching}
           paginationProps={{
             isPagination: true,
             tableName: "Campaign",
             pageSelected,
             totalCount: totalCampaign,
             rowsPerPageValue,
             setRowsPerPageValue,
             setPageSelected,
           }}
         />
       </div>
     </>
   );
};

export default Campaign;
