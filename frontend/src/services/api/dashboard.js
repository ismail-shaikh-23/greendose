import { privateRequest } from "../axios";

const ENDPOINTS = {
  DASHBOARD_CARDS: "/dashboard-admin/count",
  DASHBOARD_GRAPH: "/dashboard-admin/sales",
  DASHBOARD_EXPIRY_ALERT_PRODUCTS: "/dashboard-admin/expiry-alert",
  DASHBOARD_TOP_PRODUCTS: "/dashboard-admin/top-products",
};

    const getDashboardData = async () => {
    const response = await privateRequest.get(ENDPOINTS.DASHBOARD_CARDS);
    return response?.data;
    };
    const getDashboardGraphData = async (year) => {
    const response = await privateRequest.get(ENDPOINTS.DASHBOARD_GRAPH,{
        params:{year},
    });
    return response?.data;
    };

const getDashboardExpiryAlertData = async () => {
  const response = await privateRequest.get(
    ENDPOINTS.DASHBOARD_EXPIRY_ALERT_PRODUCTS
  );
  return response?.data;
};

const getDashboardTopProductsData = async () => {
  const response = await privateRequest.get(ENDPOINTS.DASHBOARD_TOP_PRODUCTS);
  return response?.data;
};

const DashboardService = {
  getDashboardData,
  getDashboardGraphData,
  getDashboardExpiryAlertData,
  getDashboardTopProductsData,
};

export default DashboardService;
