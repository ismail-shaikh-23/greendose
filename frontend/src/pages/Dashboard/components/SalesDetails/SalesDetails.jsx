import React,{ useEffect, useState } from "react";
import styles from "./SalesDetails.module.scss"
import LineChartComponent from "../LineChartComponent/LineChartComponent";
import ArrowIcon from "@/components/SVGComponents/ArrowIcon";
import { useDispatch } from "react-redux";
import { getDashboardGraphData } from "@/store/slices/dashboardSlice";

const SalesDetails = () => {
 const dispatch = useDispatch();
const currentYear = new Date().getFullYear();
const [selectedYear, setSelectedYear] = useState(currentYear.toString());

 useEffect(() => {
    dispatch(getDashboardGraphData(selectedYear));
  }, [dispatch, selectedYear]);
 
  const yearOptions = Array.from({ length: 3 }, (_, index) => (currentYear - index).toString());

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

    return (
      <div className={styles.mainSalesDetails}>
        <div className={styles.innerSales}>
          <h3>Sales Details</h3>
          <div className={styles.selectWrapper}>
            <select
              className={styles.selectYear}
               value={selectedYear}
                onChange={handleYearChange}
              style={{ color: "#2B303466", fontWeight: 600 }}
            >
                 {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
            </select>
            <ArrowIcon className={styles.customArrow} />
          </div>
        </div>
        <LineChartComponent />
      </div>
    );
}
export default SalesDetails;