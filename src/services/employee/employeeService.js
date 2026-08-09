import api from "@/services/api/axios";

const getStoreEmployees = async (storeId, role) => {
  const response = await api.get(`/api/employee/store/${storeId}`, {
    params: role ? { role } : {},
  });

  return response.data;
};

const createStoreAdmin = async (data) => {
  const response = await api.post("/api/employee/store-admin", data);
  return response.data;
};

const employeeService = {
  getStoreEmployees,
  createStoreAdmin,
};

export default employeeService;