import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    const isAuthRequest = config.url?.startsWith("/auth/");

    if (token && !isAuthRequest) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      "Something went wrong. Please try again.";

    const isAuthRequest = error.config?.url?.startsWith("/auth/");

    /*
     * 401 from /auth/*
     *
     * This is an authentication failure while actually trying
     * to login/reset password/etc.
     *
     * DO NOT logout or redirect.
     * Let the calling component handle the error.
     */
    if (status === 401 && isAuthRequest) {
      return Promise.reject(error);
    }

    /*
     * 401 from protected APIs
     *
     * This means the existing session/token is no longer valid.
     */
    if (status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      toast.error(message, {
        duration: 5000,
      });

      window.location.href = "/login";

      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

export default api;