// src/apis/axios.ts

import axios from 'axios';
import { LOCAL_STORAGE_KEY } from '../constant/key';

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_API_URL, // 또는 프록시 경로 '/v1'
});

// 모든 요청이 보내지기 전에 실행됩니다.
axiosInstance.interceptors.request.use(
    (config) => {
        // localStorage에서 매번 최신 토큰을 가져옵니다.
        const accessToken = localStorage.getItem('accessToken');

        // 토큰이 존재할 경우에만 Authorization 헤더에 추가합니다.
        if (accessToken) {
            config.headers.Authorization = `Bearer ${'accessToken'}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);