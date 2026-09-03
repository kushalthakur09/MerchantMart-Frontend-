import api from "@/services/api/axios";

const getDailySales = async (days = 7) => {
  const response = await api.get(
    `/api/branch-analytics/daily-sales?days=${days}`
  );
  return response.data;
};

const getTopProducts = async () => {
  const response = await api.get(
    "/api/branch-analytics/top-products"
  );
  return response.data;
};

const getTopCashiers = async () => {
  const response = await api.get(
    "/api/branch-analytics/top-cashiers"
  );
  return response.data;
};

const getCategorySales = async (date) => {
  const url = date
    ? `/api/branch-analytics/category-sales?date=${date}`
    : "/api/branch-analytics/category-sales";

  const response = await api.get(url);
  return response.data;
};

const getTodayOverview = async () => {
  const response = await api.get(
    "/api/branch-analytics/today-overview"
  );
  return response.data;
};

const getPaymentBreakdown = async (date) => {
  const url = date
    ? `/api/branch-analytics/payment-breakdown?date=${date}`
    : "/api/branch-analytics/payment-breakdown";

  const response = await api.get(url);
  return response.data;
};

export default {
  getDailySales,
  getTopProducts,
  getTopCashiers,
  getCategorySales,
  getTodayOverview,
  getPaymentBreakdown,
};  