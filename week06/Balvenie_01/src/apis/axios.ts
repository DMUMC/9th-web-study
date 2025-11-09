import axios, {
  type InternalAxiosRequestConfig,
  type AxiosRequestHeaders,
} from "axios";

const LOCAL_STORAGE_KEY = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
} as const;

// ✅ 간단한 storage 유틸
const storage = {
  get(key: string) {
    try {
      return typeof window !== "undefined"
        ? window.localStorage.getItem(key)
        : null;
    } catch {
      return null;
    }
  },
  set(key: string, val: string) {
    try {
      if (typeof window === "undefined") return;
      window.localStorage.setItem(key, val);
      window.dispatchEvent(new CustomEvent("localStorageChange"));
    } catch {}
  },
  remove(key: string) {
    try {
      if (typeof window === "undefined") return;
      window.localStorage.removeItem(key);
      window.dispatchEvent(new CustomEvent("localStorageChange"));
    } catch {}
  },
};

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshPromise: Promise<string> | null = null;

// ✅ 환경변수 혼용 대응
const API_BASE =
  import.meta.env.VITE_SERVER_API_URL ?? import.meta.env.VITE_API_URL;

// ✅ 하나의 인스턴스만 생성
export const api = axios.create({
  baseURL: `${API_BASE}`, // 이미 /v1 포함되어 있다면 뒤에 /v1 붙이지 말기
  withCredentials: true,
});

// ✅ axiosInstance alias (둘 다 동일 인스턴스)
export const axiosInstance = api;

// ──────────────────────────────
// Request Interceptor
// ──────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = storage.get(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
    if (!config.headers) config.headers = {} as AxiosRequestHeaders;

    if (token) {
      (config.headers as AxiosRequestHeaders).Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ──────────────────────────────
// Response Interceptor (401 → refresh)
// ──────────────────────────────
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // refresh 자체가 401이면 즉시 로그아웃
      if (originalRequest.url?.endsWith("/auth/refresh")) {
        storage.remove(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
        storage.remove(LOCAL_STORAGE_KEY.REFRESH_TOKEN);
        window.location.href = "/login";
        return Promise.reject(error);
      }

      // 여러 요청이 동시에 401일 때 promise 공유
      if (!refreshPromise) {
        refreshPromise = (async () => {
          const refreshToken = storage.get(LOCAL_STORAGE_KEY.REFRESH_TOKEN);
          if (!refreshToken) {
            storage.remove(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
            window.location.href = "/login";
            throw new Error("No refresh token");
          }

          const { data } = await api.post("/auth/refresh", {
            refresh: refreshToken,
          });

          const newAccess =
            data?.data?.accessToken ?? data?.accessToken;
          const newRefresh =
            data?.data?.refreshToken ?? data?.refreshToken;

          if (!newAccess)
            throw new Error("No access token in refresh response");

          storage.set(LOCAL_STORAGE_KEY.ACCESS_TOKEN, newAccess);
          if (newRefresh)
            storage.set(LOCAL_STORAGE_KEY.REFRESH_TOKEN, newRefresh);

          return newAccess;
        })()
          .catch((e) => {
            storage.remove(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
            storage.remove(LOCAL_STORAGE_KEY.REFRESH_TOKEN);
            window.location.href = "/login";
            throw e;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      const newAccessToken = await refreshPromise;
      if (!originalRequest.headers)
        originalRequest.headers = {} as AxiosRequestHeaders;

      (originalRequest.headers as AxiosRequestHeaders).Authorization = `Bearer ${newAccessToken}`;
      return api.request(originalRequest);
    }

    return Promise.reject(error);
  }
);