import React, { useCallback, useEffect, useState } from 'react'
import styles from "./OrderDetails.module.scss"
import { useParams } from 'react-router-dom'
import OrderService from '@/services/api/order'
import OrderInfo from "./components/OrderInfo/OrderInfo";
import ProductsList from "./components/ProductsList/ProductsList";

const OrderDetails = () => {
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
    <div className={styles.main}>
      <OrderInfo />
      <ProductsList products={orderDetails?.orderDetails} getData={getData} />
    </div>
  );
};

export default OrderDetails