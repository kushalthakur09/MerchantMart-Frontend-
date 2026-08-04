import api from "@/services/api/axios";

const getByStore = async (storeId) => {
  const response = await api.get(`/api/categories/store/${storeId}`);
  return response.data;
};

const create = async (category) => {
  const response = await api.post("/api/categories", category);
  return response.data;
};

const update = async (id, category) => {
  const response = await api.put(`/api/categories/${id}`, category);
  return response.data;
};

const remove = async (id) => {
  const response = await api.delete(`/api/categories/${id}`);
  return response.data;
};

const categoryService = {
  getByStore,
  create,
  update,
  remove,
};

export default categoryService;
