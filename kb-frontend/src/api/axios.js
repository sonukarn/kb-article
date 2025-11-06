import axios from "axios";
import { store } from "../app/store";
import { refreshAuth, logout } from "../features/auth/authSlice";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// attach Authorization header from Redux state (in-memory)
api.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

// refresh queue for concurrent 401s
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    if (!originalRequest) return Promise.reject(err);

    if (err.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return api(originalRequest);
          })
          .catch((e) => Promise.reject(e));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // dispatch refresh thunk (it uses axiosPublic internally)
        const payload = await store.dispatch(refreshAuth()).unwrap();
        const newToken = payload?.accessToken;
        processQueue(null, newToken);
        originalRequest.headers["Authorization"] = "Bearer " + newToken;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // logout on refresh failure
        await store.dispatch(logout());
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export default api;
