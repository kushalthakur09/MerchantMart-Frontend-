import api from "@/services/api/axios";

const getStoreEmployees = async (storeId, role) => {
  const response = await api.get(`/api/employee/store/${storeId}`, {
    params: role ? { role } : {},
  });

  return response.data;
};

const getBranchEmployees = async (branchId, role) => {
  const response = await api.get(`/api/employee/branch/${branchId}`, {
    params: role ? { role } : {},
  });

  return response.data;
};

const createStoreAdmin = async (data) => {
  const response = await api.post("/api/employee/store-admin", data);
  return response.data;
};

const createStoreEmployee = async (storeId, data) => {
  const response = await api.post(
    `/api/employee/store/${storeId}`,
    data
  );

  return response.data;
};

const createBranchEmployee = async (branchId, data) => {
  const response = await api.post(
    `/api/employee/branch/${branchId}`,
    data
  );

  return response.data;
};

const getStoreBranchManagers = async (storeId) => {
  return getStoreEmployees(storeId, "ROLE_BRANCH_MANAGER");
};

const updateEmployee = async (id, data) => {
  const response = await api.put(`/api/employee/${id}`, data);
  return response.data;
};

const deleteEmployee = async (id) => {
  const response = await api.delete(`/api/employee/${id}`);
  return response.data;
};

const employeeService = {
  getStoreEmployees,
  getBranchEmployees,
  createStoreAdmin,
  createStoreEmployee,
  createBranchEmployee,
  getStoreBranchManagers,
  updateEmployee,
  deleteEmployee,
};

export default employeeService;