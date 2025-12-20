import axios from "axios";
import { LOCAL_STORAGE_KEY } from "../constant/key";

export const apiAuth = axios.create({
    baseURL: import.meta.env.VITE_SERVER_API_URL + '/v1/auth',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const setAuthToken = (token: string | null) => {
    if (token) {
        localStorage.setItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN, token);
        apiAuth.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
        delete apiAuth.defaults.headers.common['Authorization'];
    }
};

apiAuth.interceptors.request.use(
    (config) => {
        try {
        const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
        if (accessToken) {
            config.headers = config.headers ?? {};
            if (!config.headers['Authorization'] && !config.headers['authorization']) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
            }
        }
        } catch (e) {
        console.error('apiAuth request interceptor error:', e);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiAuth.interceptors.response.use(
    (res) => res,
    (error) => {
        return Promise.reject(error);
    }
);


export default apiAuth;