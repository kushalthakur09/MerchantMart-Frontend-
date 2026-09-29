import api from "../api/axios";

const login = async (loginRequest) => {
  const response = await api.post("/auth/login", loginRequest);
  return response.data;
};

const adminLogin = async (loginRequest) => {
  const response = await api.post("/auth/admin/login", loginRequest);
  return response.data;
};

const signup = async (signupRequest) => {
  const response = await api.post("/auth/signup", signupRequest);
  return response.data;
};

const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", {
    email,
  });

  return response.data;
};

const resetPassword = async (data) => {
  const response = await api.post("/auth/reset-password", data);

  return response.data;
};

const authService = {
  login,
  adminLogin,
  signup,
  resetPassword,
  forgotPassword,
};

export default authService;
