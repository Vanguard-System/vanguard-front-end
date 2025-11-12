import axios from "axios";

const api = axios.create({
  baseURL: "https://vanguardsystem.com.br/api",
  // baseURL: "http://localhost:3000",
  withCredentials: true,
});


export default api;
