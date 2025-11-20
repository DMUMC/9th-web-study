import axios, { type InternalAxiosRequestConfig, type AxiosRequestHeaders } from 'axios';

const LOCAL_STORAGE_KEY = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
} as const;

// ✅ 훅 대신 어디서나 쓸 수 있는 최소 storage 유틸 (이 파일 내부에만 사용)
const storage = {
  get(key: string) {
    try { return typeof window !== 'undefined' ? window.localStorage.getItem(key) : null; } catch { return null; }
  },
  set(key: string, val: string) {
    try {
      if (typeof window === 'undefined') return;
      window.localStorage.setItem(key, val);
      window.dispatchEvent(new CustomEvent('localStorageChange'));
    } catch { /* empty */ }
  },
  remove(key: string) {
    try {
      if (typeof window === 'undefined') return;
      window.localStorage.removeItem(key);
      window.dispatchEvent(new CustomEvent('localStorageChange'));
    } catch { /* empty */ }
  },
};

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshPromise: Promise<string> | null = null;

// ✅ 환경변수 키 혼재 대응
const API_BASE = import.meta.env.VITE_SERVER_API_URL ?? import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: `${API_BASE}`,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = storage.get(LOCAL_STORAGE_KEY.ACCESS_TOKEN);

    // ✅ Axios v1 타입 안전 초기화
    if (!config.headers) {
      config.headers = {} as AxiosRequestHeaders; // 또는: new AxiosHeaders()
    }
    if (token) {
      (config.headers as AxiosRequestHeaders).Authorization = `Bearer ${token}`;
      // (config.headers as AxiosHeaders).set('Authorization', `Bearer ${token}`); // 위 한 줄 대신 이렇게도 가능
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // 리프레시 호출 자체가 401이면 바로 로그아웃
      if (originalRequest.url?.endsWith('/auth/refresh')) {
        storage.remove(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
        storage.remove(LOCAL_STORAGE_KEY.REFRESH_TOKEN);
        window.location.href = '/login';
        return Promise.reject(error);
      }

      // 동시 401 → 한 번만 리프레시
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

          if (!newAccess) throw new Error('No access token in refresh response');

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
          .finally(() => { refreshPromise = null; });
      }

      const newAccessToken = await refreshPromise;

      if (!originalRequest.headers) {
        originalRequest.headers = {} as AxiosRequestHeaders; // 또는 new AxiosHeaders()
      }
      (originalRequest.headers as AxiosRequestHeaders).Authorization = `Bearer ${newAccessToken}`;
      return api.request(originalRequest);
    }

    return Promise.reject(error);
  }
);