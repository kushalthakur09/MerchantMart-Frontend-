import api from "@/services/api/axios";

const getProfile = async () => {
  const response = await api.get("/api/profile");
  return response.data;
};

const updateProfile = async (data) => {
  const response = await api.put("/api/profile", data);
  return response.data;
};

const changePassword = async (data) => {
  const response = await api.put("/api/profile/password", data);
  return response.data;
};

const profileService = {
  getProfile,
  updateProfile,
  changePassword,
};

export default profileService;
