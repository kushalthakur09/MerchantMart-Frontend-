import api from "@/services/api/axios";

const getBranchesByStore = async (storeId) => {
  const response = await api.get(`/api/branch/store/${storeId}`);
  return response.data;
};

const createBranch = async (data) => {
  const response = await api.post("/api/branch", data);
  return response.data;
};

const updateBranch = async (id, data) => {
  const response = await api.put(`/api/branch/${id}`, data);
  return response.data;
};

const deleteBranch = async (id) => {
  const response = await api.delete(`/api/branch/${id}`);
  return response.data;
};

const branchService = {
  getBranchesByStore,
  createBranch,
  updateBranch,
  deleteBranch,
};

export default branchService;