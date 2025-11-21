// src/apis/axios.ts
import axios, { type InternalAxiosRequestConfig } from 'axios';
import { LOCAL_STORAGE_KEY } from '../constants/key';

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshPromise: Promise<string> | null = null;

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessTokenItem = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
    const accessToken = accessTokenItem ? JSON.parse(accessTokenItem) : null;

    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest: CustomInternalAxiosRequestConfig = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      if (originalRequest.url === `/v1/auth/refresh`) {
        console.error('Refresh token is invalid or expired. Logging out.');
        
        localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
        localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
        localStorage.removeItem('userName'); // 혜니님이 쓰시던 키
        localStorage.removeItem('userEmail'); // 혜니님이 쓰시던 키
        
        window.location.href = '/login';
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = (async () => {
          const refreshTokenItem = localStorage.getItem(LOCAL_STORAGE_KEY.refreshToken);
          const refreshToken = refreshTokenItem ? JSON.parse(refreshTokenItem) : null;
          
          if (!refreshToken) {
            console.error('No refresh token found. Logging out.');
            throw new Error('No refresh token');
          }

          const { data } = await axiosInstance.post(
            `/v1/auth/refresh`,
            { refresh: refreshToken },
          );

          const newAccessToken = data.data.accessToken;
          const newRefreshToken = data.data.refreshToken;

          localStorage.setItem(LOCAL_STORAGE_KEY.accessToken, JSON.stringify(newAccessToken));
          if (newRefreshToken) {
             localStorage.setItem(LOCAL_STORAGE_KEY.refreshToken, JSON.stringify(newRefreshToken));
          }

          return newAccessToken;
        })()
          .catch((err) => {
            localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
            localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
            localStorage.removeItem('userName');
            localStorage.removeItem('userEmail');
            window.location.href = '/login';
            return Promise.reject(err);
          })
          .finally(() => {
            refreshPromise = null;
          });
      }
      
      return refreshPromise.then((newAccessToken) => {
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axiosInstance.request(originalRequest);
      });
    }
    
    return Promise.reject(error);
  },
);