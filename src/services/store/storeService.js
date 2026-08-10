import api from "@/services/api/axios";

const createStore = async (data) => {
  const response = await api.post("/api/store", data);
  return response.data;
};

const getStoreByAdmin = async () => {
  const response = await api.get("/api/store/admin");
  return response.data;
};

const getAllStores = async () => {
  const response = await api.get("/api/store");
  return response.data;
};

const activateStore = async (storeId) => {
  const response = await api.patch(
    `/api/super-admin/stores/${storeId}/activate`
  );
  return response.data;
};

const deactivateStore = async (storeId) => {
  const response = await api.patch(
    `/api/super-admin/stores/${storeId}/deactivate`
  );
  return response.data;
};

const blockStore = async (storeId) => {
  const response = await api.patch(
    `/api/super-admin/stores/${storeId}/block`
  );
  return response.data;
};

const unblockStore = async (storeId) => {
  const response = await api.patch(
    `/api/super-admin/stores/${storeId}/unblock`
  );
  return response.data;
};

const storeService = {
  createStore,
  getStoreByAdmin,
  getAllStores,
  activateStore,
  deactivateStore,
  blockStore,
  unblockStore,
};

export default storeService;