import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "@/lib/constants/api";

// Queue for failed requests during token refresh
interface QueueItem {
  resolve: () => void;
  reject: (error: Error) => void;
}
// Use NEXT_PUBLIC_ prefix so it's available on client-side
// Set NEXT_PUBLIC_USE_AUTH_PROXY=true in .env.local for development
const USE_API_PROXY =
  process.env.NEXT_PUBLIC_USE_AUTH_PROXY === "true" || false;

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: Error | null = null) => {
  failedQueue.forEach((item) => {
    if (error) {
      item.reject(error);
    } else {
      item.resolve();
    }
  });
  failedQueue = [];
};

// Create axios instance
// In development with proxy enabled, all requests go through /api/*
// In production, requests go directly to backend
const api = axios.create({
  baseURL: USE_API_PROXY ? "/api" : API_BASE_URL,
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error) => Promise.reject(error),
);

// Response interceptor - handle 401 and refresh token
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Check if it's a 401 error that should trigger refresh
    const isTokenExpired =
      (error.response?.data as any)?.message === "access token not provided" ||
      (error.response?.data as any)?.message === "access token expired";
    if (isTokenExpired && !originalRequest._retry) {
      originalRequest._retry = true;

      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise<void>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        await api.post("/auth/refresh");
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error);
        if (typeof window !== "undefined") {
          window.location.href = "/sign-in";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
