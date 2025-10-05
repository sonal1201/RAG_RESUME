import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
const API = axios.create({ baseURL });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let pendingQueue = [];

API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config || {};
    const status = error.response?.status;

    if (status === 401 && !original.__isRetryRequest) {
      if (isRefreshing) {
        // queue the request until refresh completes
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        })
          .then((token) => {
            original.headers = original.headers || {};
            original.headers.Authorization = `Bearer ${token}`;
            original.__isRetryRequest = true;
            return API.request(original);
          })
          .catch((e) => Promise.reject(e));
      }

      try {
        isRefreshing = true;
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");
        const { data } = await API.post("/auth/refresh", { token: refreshToken });
        const newAccess = data.accessToken;
        if (!newAccess) throw new Error("No access token returned");
        localStorage.setItem("accessToken", newAccess);
        // resolve queued requests
        pendingQueue.forEach((p) => p.resolve(newAccess));
        pendingQueue = [];
        // retry original
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${newAccess}`;
        original.__isRetryRequest = true;
        return API.request(original);
      } catch (e) {
        pendingQueue.forEach((p) => p.reject(e));
        pendingQueue = [];
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        if (typeof window !== "undefined") window.location.assign("/login");
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default API;
