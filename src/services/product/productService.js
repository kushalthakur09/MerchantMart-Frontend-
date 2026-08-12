import api from "@/services/api/axios";

const getByStore = async (storeId) => {
  const response = await api.get(
    `/api/product/store/${storeId}`
  );

  return response.data;
};

const create = async (product) => {
  const response = await api.post(
    "/api/product",
    product
  );

  return response.data;
};

const update = async (id, product) => {
  const response = await api.put(
    `/api/product/${id}`,
    product
  );

  return response.data;
};

const remove = async (id) => {
  const response = await api.delete(
    `/api/product/${id}`
  );

  return response.data;
};

const search = async (storeId, keyword) => {
  const response = await api.get(
    `/api/product/store/${storeId}/search`,
    {
      params: { keyword },
    }
  );

  return response.data;
};

const productService = {
  getByStore,
  create,
  update,
  remove,
  search,
};

export default productService;