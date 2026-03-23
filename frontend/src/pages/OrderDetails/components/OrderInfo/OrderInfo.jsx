    import React,  { useCallback, useEffect, useState } from 'react'
    import styles from "./OrderInfo.module.scss"
    import OrderService from '@/services/api/order'
    import { useParams } from 'react-router-dom';
import { combineClasses } from '@/lib/utils';
import { CURRENCY_SYMBOL } from "@/lib/constants";

const OrderInfo = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const { orderId } = useParams();
  const getData = useCallback(async () => {
    const data = await OrderService.getOrderDetails(orderId);
    setOrderDetails(data?.data);
  }, [orderId]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <div className={styles.orderDetails}>
      <div className={styles.topContainer}>
      <div className={styles.orderItem}>
        <div className={combineClasses(styles.label, styles.bold)}>
          Order Number
        </div>
        <div className={styles.value}>{orderDetails?.orderNumber}</div>
      </div>

      <div className={styles.orderItem}>
        <div className={combineClasses(styles.label, styles.bold)}>
          Invoice Number
        </div>
        <div className={styles.value}>
          {orderDetails?.invoiceNumber ?? "N/A"}
        </div>
      </div>

      <div className={styles.orderItem}>
        <div className={combineClasses(styles.label, styles.bold)}>
          Customer Name
        </div>
        <div className={styles.value}>
          {orderDetails?.customer?.firstName} {orderDetails?.customer?.lastName}
        </div>
      </div>

      <div className={styles.orderItem}>
        <div className={combineClasses(styles.label, styles.bold)}>Email</div>
        <div className={styles.value}>{orderDetails?.customer?.email}</div>
      </div>
      </div>

      <div className={styles.orderSummary}>
        <div className={styles.summaryItem}>
          <div className={styles.label}>Subtotal</div>
          <div className={styles.value}>
            {CURRENCY_SYMBOL["AE"]} {orderDetails?.subTotal}
          </div>
        </div>

        <div className={styles.summaryItem}>
          <div className={styles.label}>Discount</div>
          <div className={styles.value}>
            {CURRENCY_SYMBOL["AE"]} {orderDetails?.discount}
          </div>
        </div>

        <div className={styles.summaryItem}>
          <div className={combineClasses(styles.label, styles.total)}>
            Total Amount
          </div>
          <div className={combineClasses(styles.value, styles.total)}>
            {CURRENCY_SYMBOL["AE"]} {orderDetails?.totalAmount}
          </div>
        </div>
      </div>
    </div>
  );
};

    export default OrderInfo;