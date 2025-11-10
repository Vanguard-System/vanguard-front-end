import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.BACKEND_ROUTE, 
  withCredentials: true,
});

export default api;
