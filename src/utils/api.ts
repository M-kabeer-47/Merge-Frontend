import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// Queue for failed requests during token refresh
interface QueueItem {
  resolve: () => void;
  reject: (error: Error) => void;
}

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
// Cookies are sent automatically with withCredentials: true
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true, // Send cookies with all requests
});

// Request interceptor - add debug logging
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Debug: Check if cookies exist in browser
    if (typeof document !== "undefined") {
      console.log("[axios] Request to:", config.url);
      console.log("[axios] Document cookies:", document.cookie);
      console.log("[axios] withCredentials:", config.withCredentials);
    }
    return config;
  },
  (error) => Promise.reject(error)
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
      error.response?.status === 401 &&
      (error.response?.data as any)?.message?.toLowerCase().includes("expired");

    if (isTokenExpired && !originalRequest._retry) {
      originalRequest._retry = true;

      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise<void>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            // Retry original request - cookies will have new token
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        // Call refresh endpoint - backend extracts refresh token from cookies
        // and sets new cookies automatically
        await api.post("/auth/refresh");

        // Process queued requests - they will use new cookies
        processQueue(null);

        // Retry original request with new cookies
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - reject all queued requests
        processQueue(refreshError as Error);

        // Redirect to login
        if (typeof window !== "undefined") {
          window.location.href = "/sign-in";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
