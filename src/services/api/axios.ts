import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: "https://seu-backend.com/api",
});
export default api;

export { AxiosError };