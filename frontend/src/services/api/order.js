import { privateRequest } from "../axios";

const ENDPOINTS = {
  ORDER: "/order",
  PAYMENT: (id) => `/order/payment-status/${id}`,
  ORDERS_STATUS: (id) => `/order/status/${id}`,
  DELIVERY_STATUS: (id) => `/order/delivery-status/${id}`,
  ORDER_ID: (id) => `/order/${id}`,
  ORDER_DETAILS: (id) => `/order/details/${id}`,
};

const getOrders = async (params) => {
  const response = await privateRequest.get(ENDPOINTS.ORDER, { params });
  return response?.data;
}

const updatePaymentStatus = async ({ id, status }) => {
  const response = await privateRequest.put(ENDPOINTS.PAYMENT(id), {
    paymentStatus: status,
  });
  return response?.data;
};

const updateOrderStatus = async ({ id, status }) => {
  const response = await privateRequest.put(ENDPOINTS.ORDERS_STATUS(id), {
    status,
  });
  return response?.data;
};

const updateDeliveryStatus = async ({ id, status }) => {
  const response = await privateRequest.put(ENDPOINTS.DELIVERY_STATUS(id), {
    status,
  });
  return response?.data;
};

const getOrderDetails = async (id) => {
  const response = await privateRequest.get(ENDPOINTS.ORDER_DETAILS(id));
  return response?.data;
};

const OrderService = {
  getOrders,
  updatePaymentStatus,
  updateOrderStatus,
  getOrderDetails,
  updateDeliveryStatus,
};

export default OrderService