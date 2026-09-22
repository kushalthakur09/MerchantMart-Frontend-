import api from "./axios";

export const createRazorpayCheckout = async (data) => {
  const response = await api.post(
    "/api/payments/razorpay/checkout",
    data
  );

  return response.data;
};