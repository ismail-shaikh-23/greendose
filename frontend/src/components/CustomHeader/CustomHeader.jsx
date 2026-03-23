import React from "react";
import styles from "./CustomHeader.module.scss";
import Button from "../Button/Button";
import SearchIcon from "../SVGComponents/SearchIcon";
import PlusIcon from "../SVGComponents/PlusIcon";
import FilterIcon from "../SVGComponents/FilterIcon"
import { setModalOpen } from "@/store/slices/globalSlice";
import { MODAL_ID } from "@/lib/constants";
import { useDispatch } from "react-redux";
import ShareIcon from "../SVGComponents/ShareIcon";
import TabPanel from "../TabPanel/TabPanel";


const CustomHeader = ({ search, setSearch, buttonLabel, sharebuttonLabel, onButtonClick, showFilter, shareButton, tabNames, showTab }) => {
  const onSearchChange = (e) => {
    setSearch?.(e.target.value);
  };
   const dispatch = useDispatch();

  const openFilter = () => {
    dispatch(setModalOpen({ id: MODAL_ID.FILTER_MODAL }));
  };
   const openShareModal = () => {
    dispatch(setModalOpen({ id: MODAL_ID.SHARE_MODAL }));
  };
  return (
    <div className={styles.topSection}>
      <div className={styles.filterSearch}>
       
        <span className={styles.search}>
          <SearchIcon className={styles.searchIcon} />
          <input
            value={search ?? ""}
            onChange={onSearchChange}
            type="text"
            placeholder="Search"
          />
          
        </span>
        {showFilter && 
         (  <span className={styles.filter} onClick={openFilter}>
        <FilterIcon />
        </span>)}

        {showTab &&
         (<span className={styles.tabsContainer}>
         <TabPanel tabNames={tabNames} />
        </span>)}  
      
      </div>

      {shareButton &&
      <Button className={styles.shareButton}  outlined onClick={openShareModal} >  
      <ShareIcon className={styles.shareicon}/>
         {sharebuttonLabel}
      </Button>}

      {onButtonClick && (
        <Button
          onClick={onButtonClick}
          className={styles.button}
          variant="filled"
        >
         <PlusIcon className={styles.plusicon}/>
          {buttonLabel}
        </Button>
      )}
    </div>
  );
};

export default CustomHeader;
