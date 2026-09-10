import api from "@/services/api/axios";

const getAll = async () => {
  const response = await api.get("/api/user/store-admins");
  return response.data;
};

const storeAdminService = {
  getAll,
};

export default storeAdminService;