import axios from "axios";

const baseURL = "http://localhost:3000/api";
const API = axios.create({ baseURL });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
