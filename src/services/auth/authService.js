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

const authService = {
  login,
  adminLogin,
  signup,
};

export default authService;
