import styles from "./Card.module.scss";
import React from "react";
import CardUpIcon from "@/components/SVGComponents/CardUpIcon";
import CardDownIcon from "@/components/SVGComponents/CardDownIcon";
import { formatNumberWithSuffix } from "@/lib/utils";

const Card = ({ name, icon: Icon, count, percentage, text }) => {
  return (
    <div className={styles.dashboardCard}>
      <div className={styles.cardHeader}>
        <div className={styles.cardData}>
          <p className={styles.cardTitle}>{name}</p>
          <p className={styles.cardCount}>{count}</p>
        </div>
        <Icon className={styles.cardIcon} />
      </div>
      <div className={styles.cardBody}>
        {percentage > 0 ? (
          <CardUpIcon className={styles.percentageIcon} />
        ) : (
          <CardDownIcon className={styles.percentageIcon} />
        )}
        
        <span
          className={`${percentage > 0 ? styles.positive : styles.negative} ${styles.cardPercentage}`}
        >
         {formatNumberWithSuffix(Math.round (Math.abs(percentage)))}%
        </span>
        <span className={styles.cardText}>{text}</span>
      </div>
    </div>
  );
};

export default Card;
