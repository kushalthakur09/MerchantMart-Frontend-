import api from "@/services/api/axios";

const getBranchesByStore = async (storeId) => {
  const response = await api.get(`/api/branch/store/${storeId}`);
  return response.data;
};

const getBranchById = async (id) => {
  const response = await api.get(`/api/branch/${id}`);
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

const deactivateBranch = async (id) => {
  const response = await api.put(`/api/branch/${id}/deactivate`);
  return response.data;
};

const activateBranch = async (id) => {
  const response = await api.put(`/api/branch/${id}/activate`);
  return response.data;
};

const branchService = {
  getBranchesByStore,
  getBranchById,
  createBranch,
  updateBranch,
  deactivateBranch,
  activateBranch,
};

export default branchService;