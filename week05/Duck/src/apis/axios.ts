import axios from "axios";
import { postRefreshToken } from "./auth";
import { useAuthStore } from "../store/authStore";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
});

const PUBLIC_API_PATHS = [
  "/v1/auth/signin",
  "/v1/auth/signup",
  "/v1/auth/refresh",
];

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: string) => void;
  reject: (error?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token || undefined);
    }
  });

  failedQueue = [];
};

const getAccessToken = (): string | null => {
  try {
    const authStorage = localStorage.getItem("auth-storage");
    if (!authStorage) return null;

    const parsedAuth = JSON.parse(authStorage);
    return parsedAuth?.state?.accessToken || null;
  } catch {
    return null;
  }
};

const getRefreshToken = (): string | null => {
  try {
    const authStorage = localStorage.getItem("auth-storage");
    if (!authStorage) return null;

    const parsedAuth = JSON.parse(authStorage);
    return parsedAuth?.state?.refreshToken || null;
  } catch {
    return null;
  }
};

axiosInstance.interceptors.request.use((config) => {
  const isPublicApi = PUBLIC_API_PATHS.some((path) =>
    config.url?.includes(path)
  );

  if (!isPublicApi) {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getRefreshToken();

        if (refreshToken) {
          const response = await postRefreshToken(refreshToken);
          const { accessToken, refreshToken: newRefreshToken } = response.data;

          try {
            const authStorage = localStorage.getItem("auth-storage");
            if (authStorage) {
              const parsedAuth = JSON.parse(authStorage);
              const updatedAuth = {
                ...parsedAuth,
                state: {
                  ...parsedAuth.state,
                  accessToken,
                  refreshToken: newRefreshToken,
                },
              };
              localStorage.setItem("auth-storage", JSON.stringify(updatedAuth));
            }
          } catch {}

          useAuthStore.getState().updateTokens(accessToken, newRefreshToken);
          processQueue(null, accessToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("auth-storage");
        useAuthStore.getState().setLogout();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
