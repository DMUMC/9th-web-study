// src/lib/axios.ts (수정본)
import axios from 'axios';

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
  (error) => {
    return Promise.reject(error);
  }
);