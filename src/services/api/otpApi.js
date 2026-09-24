import api from "./axios";

export const verifyOtp = async (data) => {
  const response = await api.post("/api/auth/otp/verify", data);
  return response.data;
};

export const resendOtp = async (data) => {
  const response = await api.post("/api/auth/otp/resend", data);
  return response.data;
};