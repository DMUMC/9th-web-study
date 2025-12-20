import axios, { type InternalAxiosRequestConfig, type AxiosRequestHeaders } from 'axios';
import { storage } from '../utils/storage';
import { LOCAL_STORAGE_KEY } from '../key';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshPromise: Promise<string> | null = null;

const API_BASE = import.meta.env.VITE_SERVER_API_URL ?? import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: `${API_BASE}/v1`,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = storage.get(LOCAL_STORAGE_KEY.ACCESS_TOKEN);

    if (!config.headers) {
      config.headers = {} as AxiosRequestHeaders;
    }
    if (token) {
      (config.headers as AxiosRequestHeaders).Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // 401인 경우만 처리
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (originalRequest.url?.endsWith('/auth/refresh')) {
        storage.remove(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
        storage.remove(LOCAL_STORAGE_KEY.REFRESH_TOKEN);
        window.location.href = '/login';
        return Promise.reject(error);
      }

      // 여러 요청이 동시에 터지면 Promise 공유
      if (!refreshPromise) {
        refreshPromise = (async () => {
          const refreshToken = storage.get(LOCAL_STORAGE_KEY.REFRESH_TOKEN);
          if (!refreshToken) {
            storage.remove(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
            window.location.href = '/login';
            throw new Error('No refresh token');
          }

          const { data } = await api.post('/auth/refresh', { refresh: refreshToken });
          const newAccess = data?.data?.accessToken ?? data?.accessToken;
          const newRefresh = data?.data?.refreshToken ?? data?.refreshToken;

          if (!newAccess) throw new Error('No access token returned');

          storage.set(LOCAL_STORAGE_KEY.ACCESS_TOKEN, newAccess);
          if (newRefresh) storage.set(LOCAL_STORAGE_KEY.REFRESH_TOKEN, newRefresh);

          return newAccess;
        })()
          .catch((e) => {
            storage.remove(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
            storage.remove(LOCAL_STORAGE_KEY.REFRESH_TOKEN);
            window.location.href = '/login';
            throw e;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      const newToken = await refreshPromise;
      if (!originalRequest.headers) {
        originalRequest.headers = {} as AxiosRequestHeaders;
      }
      (originalRequest.headers as AxiosRequestHeaders).Authorization = `Bearer ${newToken}`;
      return api.request(originalRequest);
    }

    return Promise.reject(error);
  }
);