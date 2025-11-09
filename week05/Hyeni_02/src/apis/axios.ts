// src/apis/axios.ts
import axios, { type AxiosError } from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8000/v1', 
});

api.interceptors.request.use(
  (config) => {
    if (!config.url?.startsWith('/auth')) {
      const tokenItem = localStorage.getItem('authToken');
      if (tokenItem) {
        const token = JSON.parse(tokenItem);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest && !(originalRequest as any)._retry) {
      
      (originalRequest as any)._retry = true; 

      const refreshTokenItem = localStorage.getItem('refreshToken');
      if (!refreshTokenItem) {
        alert('세션이 만료되었습니다. 다시 로그인해주세요.');
        window.location.href = '/login';
        return Promise.reject(error);
      }
      
      const refreshToken = JSON.parse(refreshTokenItem);

      try {
        const response = await api.post('/auth/refresh', {}, {
          headers: {
            Authorization: `Bearer ${refreshToken}`
          }
        });

        const newAccessToken = response.data.data.accessToken; 
        const newRefreshToken = response.data.data.refreshToken;

        localStorage.setItem('authToken', JSON.stringify(newAccessToken));
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', JSON.stringify(newRefreshToken));
        }

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);

      } catch (refreshError) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        
        alert('세션이 만료되었습니다. 다시 로그인해주세요.');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);