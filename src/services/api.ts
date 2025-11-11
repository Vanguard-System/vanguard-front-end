import axios from "axios";

const api = axios.create({
  baseURL: "https://vanguardsystem.com.br", // URL do seu backend
  withCredentials: true, // mantém cookies/session
});

export default api;
