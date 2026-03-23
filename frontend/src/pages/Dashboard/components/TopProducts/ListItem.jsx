import React from "react";
import styles from "./ListItem.module.scss";
import DashboardUpIcon from "@/components/SVGComponents/DashboardUpIcon";
import CardUpIcon from "@/components/SVGComponents/CardUpIcon";
import CardDownIcon from "@/components/SVGComponents/CardDownIcon";
import DashboardDownIcon from "@/components/SVGComponents/DashboardDownIcon";
import Tooltip from "@/components/Tooltip/Tooltip";
const ListItem = ({ name, sr, image, number, currency, category }) => {
  return (
    <div className={styles.container}>
      <div className={styles.productSrNo}>
        <p className={styles.srNo}>{sr}</p>
      </div>
      <div className={styles.productName}>
        <img className={styles.productImage} src={image} alt="" />
        <div className={styles.productDetails}>
          <p className={styles.productName}>
            <Tooltip data={name} id={sr?.toString()} maxLength={30} />
          </p>
          <p className={styles.productInfo}>{category}</p>
          <p className={styles.productInfo}>{currency}</p>
        </div>
      </div>
      <div className={styles.salesTrend}>
        {number > 0 ? (
          <CardUpIcon className={styles.icon} />
        ) : (
          <CardDownIcon className={styles.icon} />
        )}
        <span
          className={`${styles.trendPercentage} ${number > 0 ? styles.positive : styles.negative}`}
        >
          {number > 0 ? "+" : "-"}
          {Math.abs(number)}%
        </span>
      </div>
    </div>
  );
};
export default ListItem;
