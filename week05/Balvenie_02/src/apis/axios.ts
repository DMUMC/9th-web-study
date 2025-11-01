import axios from 'axios';
import { authStore } from '../authStore';

const baseURL = import.meta.env.VITE_SERVER_API_URL;

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

// 요청 인터셉터: Authorization 부착
axiosInstance.interceptors.request.use((config) => {
  const token = authStore.token;
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

// 401 응답 처리: 1회 리프레시 → 원 요청 재시도
let refreshInFlight: Promise<void> | null = null;
const subscribers: Array<() => void> = [];
const onRefreshed = () => { subscribers.splice(0).forEach((fn) => fn()); };

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { config, response } = error || {};
    if (!response || response.status !== 401 || (config as any)?._retry) {
      return Promise.reject(error);
    }

    if (!refreshInFlight) {
      refreshInFlight = authStore.refresh().finally(() => {
        refreshInFlight = null;
        onRefreshed();
      });
    }

    await new Promise<void>((resolve, reject) => {
      subscribers.push(resolve);
      refreshInFlight!.catch(reject);
    });

    (config as any)._retry = true;
    return axiosInstance(config);
  }
);