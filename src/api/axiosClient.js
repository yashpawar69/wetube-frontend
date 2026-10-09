import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// The backend issues short-lived access tokens as httpOnly cookies and
// supports refreshing them via /users/refresh-token. When any request comes
// back 401, we try refreshing once and replaying the original request
// before giving up and treating the user as logged out.
let isRefreshing = false;
let pendingQueue = [];

const flushQueue = (error) => {
  pendingQueue.forEach(({ resolve, reject, originalRequest }) => {
    if (error) reject(error);
    else resolve(api(originalRequest));
  });
  pendingQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    const isAuthRoute =
      originalRequest?.url?.includes("/users/login") ||
      originalRequest?.url?.includes("/users/register") ||
      originalRequest?.url?.includes("/users/refresh-token");

    if (status !== 401 || isAuthRoute || originalRequest?._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject, originalRequest });
      });
    }

    isRefreshing = true;
    try {
      await api.post("/users/refresh-token");
      isRefreshing = false;
      flushQueue(null);
      return api(originalRequest);
    } catch (refreshError) {
      isRefreshing = false;
      flushQueue(refreshError);
      return Promise.reject(refreshError);
    }
  }
);

// Pulls a readable message out of the backend's ApiError/ApiResponse shape.
export const getErrorMessage = (error) =>
  error?.response?.data?.message || error?.message || "Something went wrong";
