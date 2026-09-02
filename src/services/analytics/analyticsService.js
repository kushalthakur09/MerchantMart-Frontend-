import api from "@/services/api/axios";

const getOverview = async () => {
  const response = await api.get("/api/store/analytics/overview");
  return response.data;
};

const getSalesTrends = async (period = "daily") => {
  const response = await api.get(
    `/api/store/analytics/sales-trends?period=${period}`
  );
  return response.data;
};

const getCategorySales = async () => {
  const response = await api.get(
    "/api/store/analytics/sales/category"
  );
  return response.data;
};

const getPaymentMethodSales = async () => {
  const response = await api.get(
    "/api/store/analytics/sales/payment-method"
  );
  return response.data;
};

const getBranchSales = async () => {
  const response = await api.get(
    "/api/store/analytics/sales/branch"
  );
  return response.data;
};

const getAlerts = async () => {
  const response = await api.get(
    "/api/store/analytics/alerts"
  );
  return response.data;
};

const analyticsService = {
  getOverview,
  getSalesTrends,
  getCategorySales,
  getPaymentMethodSales,
  getBranchSales,
  getAlerts,
};

export default analyticsService;