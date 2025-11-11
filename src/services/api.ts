import axios from "axios";

const api = axios.create({
  baseURL: "https://vanguardsystem.com.br/api",
  withCredentials: true,
});


export default api;
