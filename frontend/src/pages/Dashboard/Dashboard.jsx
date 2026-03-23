import React, { useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardData } from "@/store/slices/dashboardSlice";
import styles from "./Dashboard.module.scss";
import CardCustumer from "@/components/SVGComponents/CardCustumer";
import CardVendor from "@/components/SVGComponents/CardVendor";
import CardSales from "@/components/SVGComponents/CardSales";
import CardOrder from "@/components/SVGComponents/CardOrder";
import CardPending from "@/components/SVGComponents/CardPending";
import Card from "./components/Card/Card";
import SalesDetails from "./components/SalesDetails/SalesDetails";
import ExpiryAlertProducts from "./components/ExpiryAlertProducts/ExpiryAlertProducts";
import TopProducts from "./components/TopProducts/TopProducts";
import { CURRENCY_SYMBOL } from "@/lib/constants";
import { formatNumberWithSuffix } from "@/lib/utils";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.dashboard);

  const cards = [
    {
      name: "Total Customer",
      count: data.totalCustomer,
      icon: CardCustumer,
      percentage: data.customerGrowth,
      text:
        data.customerGrowth > 0 ? "Up from yesterday" : " Down from yesterday",
    },
    {
      name: "Total Order",
      count: data.totalOrder,
      icon: CardOrder,
      percentage: data.orderGrowth,
      text: data.orderGrowth > 0 ? "Up from yesterday" : " Down from yesterday",
    },
    {
      name: "Total Sales",
      count: `${CURRENCY_SYMBOL["AE"]} ${formatNumberWithSuffix(data.totalSale)}`,
      icon: CardSales,
      percentage: data.salesGrowth,
      text: data.salesGrowth > 0 ? "Up from yesterday" : " Down from yesterday",
    },
    {
      name: "Total Pending",
      count: data.totalPending,
      icon: CardPending,
      percentage: data.pendingOrderGrowth,
      text:
        data.pendingOrderGrowth > 0
          ? "Up from yesterday"
          : " Down from yesterday",
    },
    {
      name: "Total Vendor",
      count: data.totalVendor,
      icon: CardVendor,
      percentage: data.vendorGrowth,
      text:
        data.vendorGrowth > 0 ? "Up from yesterday" : " Down from yesterday",
    },
  ];

  useEffect(() => {
    dispatch(getDashboardData());
  }, [dispatch]);

  return (
    <div className={styles.main}>
      <div className={styles.cardParent}>
        {cards?.map((card) => (
          <Card
            key={card.name}
            name={card.name}
            count={card.count}
            icon={card.icon}
            percentage={card.percentage}
            percentageUpIcon={card.percentageUpIcon}
            percentageDownIcon={card.percentageDownIcon}
            text={card.text}
          />
        ))}
      </div>
      <SalesDetails className={styles.SalesDetails} />
      <div className={styles.dashboardProduct}>
        <TopProducts className={styles.item} />
        <ExpiryAlertProducts className={styles.item} />
      </div>
    </div>
  );
};

export default Dashboard;
