import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: import.meta.env.VITE_SCHOOL_API_URL || "http://localhost:4000",
});

// Request interceptor for API calls
api.interceptors.request.use(
  async (config) => {
    const token = Cookies.get('yhanko_super_admin_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      Cookies.remove("yhanko_super_admin_token", { path: '/' });
      Cookies.remove("yhanko_super_admin_user", { path: '/' });
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;
export { AxiosError };