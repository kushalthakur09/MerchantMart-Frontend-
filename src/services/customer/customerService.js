import api from "@/services/api/axios";

const getAll = async () => {
  const response = await api.get("/api/customer");
  return response.data;
};

const search = async (keyword) => {
  const response = await api.get("/api/customer/search", {
    params: { keyword },
  });
  return response.data;
};

const getById = async (id) => {
  const response = await api.get(`/api/customer/${id}`);
  return response.data;
};

const create = async (customer) => {
  const response = await api.post("/api/customer", customer);
  return response.data;
};

const update = async (id, customer) => {
  const response = await api.put(`/api/customer/${id}`, customer);
  return response.data;
};

const deactivate = async (id) => {
  const response = await api.put(
    `/api/customer/${id}/deactivate`
  );
  return response.data;
};

const activate = async (id) => {
  const response = await api.put(
    `/api/customer/${id}/activate`
  );
  return response.data;
};

const customerService = {
  getAll,
  search,
  getById,
  create,
  update,
  deactivate,
  activate,
};

export default customerService;