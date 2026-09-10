import api from "@/services/api/axios";

// =========================================================
// CREATE ORDER
// =========================================================

const create = async (order) => {
  const response = await api.post("/api/order", order);
  return response.data;
};

// =========================================================
// SINGLE ORDER
// =========================================================

const getById = async (id) => {
  const response = await api.get(`/api/order/${id}`);
  return response.data;
};

// =========================================================
// STORE ORDER HISTORY
// =========================================================

const getByStore = async (storeId) => {
  const response = await api.get(
    `/api/order/store/${storeId}`
  );
  return response.data;
};

// =========================================================
// BRANCH ORDER HISTORY
// =========================================================

const getByBranch = async (
  branchId,
  filters = {}
) => {
  const response = await api.get(
    `/api/order/branch/${branchId}`,
    {
      params: {
        customerId: filters.customerId || undefined,
        cashierId: filters.cashierId || undefined,
        paymentType: filters.paymentType || undefined,
        orderStatus: filters.orderStatus || undefined,
      },
    }
  );

  return response.data;
};

// =========================================================
// CASHIER ORDERS
// =========================================================

const getByCashier = async (cashierId) => {
  const response = await api.get(
    `/api/order/cashier/${cashierId}`
  );
  return response.data;
};

// =========================================================
// CUSTOMER ORDER HISTORY
// =========================================================

const getByCustomer = async (customerId) => {
  const response = await api.get(
    `/api/order/customer/${customerId}`
  );
  return response.data;
};

// =========================================================
// TODAY'S BRANCH ORDERS
// =========================================================

const getTodayByBranch = async (branchId) => {
  const response = await api.get(
    `/api/order/today/branch/${branchId}`
  );
  return response.data;
};

// =========================================================
// RECENT BRANCH ORDERS
// =========================================================

const getRecentByBranch = async (branchId) => {
  const response = await api.get(
    `/api/order/recent/branch/${branchId}`
  );
  return response.data;
};

// =========================================================
// SUPER ADMIN VIEW AlL ORDERS
// // =========================================================
const getAll = async () => {
  const response = await api.get("/api/order");
  return response.data;
};

const orderService = {
  create,
  getById,
  getByStore,
  getByBranch,
  getByCashier,
  getByCustomer,
  getTodayByBranch,
  getRecentByBranch,
  getAll,
};

export default orderService;