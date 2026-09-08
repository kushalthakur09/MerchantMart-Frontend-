import api from "@/services/api/axios";

const create = async (order) => {
  const response = await api.post("/api/order", order);
  return response.data;
};

const getById = async (id) => {
  const response = await api.get(`/api/order/${id}`);
  return response.data;
};

const getTodayByBranch = async (branchId) => {
  const response = await api.get(
    `/api/order/today/branch/${branchId}`
  );
  return response.data;
};

const orderService = {
  create,
  getById,
  getTodayByBranch,
};

export default orderService;