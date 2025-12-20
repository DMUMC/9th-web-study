// src/utils/AxiosInstance.ts
import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constant/key";

type CustomRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const AUTH_PATHS = ["/signin", "/signup", "/google", "/refresh"];
const isAuthPath = (url?: string) => {
  if (!url) return false;
  try {
    const path = new URL(url, "http://dummy").pathname;
    return AUTH_PATHS.includes(path) || AUTH_PATHS.some((p) => path.endsWith(p));
  } catch {
    return AUTH_PATHS.includes(url) || AUTH_PATHS.some((p) => url.endsWith(p));
  }
};

export const apiAuth = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/v1/auth`,
});

// 호환용 별칭 (다른 파일에서 axiosInstance를 import해도 동작)
export const axiosInstance = apiAuth;

apiAuth.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // auth 자체 엔드포인트(로그인/회원가입/리프레시/구글)는 Authorization 제외
    if (isAuthPath(config.url)) return config;

    const { getItem } = useLocalStorage(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
    const ACCESS_TOKEN = getItem();
    if (ACCESS_TOKEN) {
      (config.headers as any) = (config.headers as any) ?? {};
      (config.headers as any).Authorization = `Bearer ${ACCESS_TOKEN}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

let refreshPromise: Promise<string> | null = null;

apiAuth.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomRequestConfig | undefined;
    const status = (error.response && error.response.status) || undefined;

    if (!originalRequest || !status) return Promise.reject(error);
    if (isAuthPath(originalRequest.url)) return Promise.reject(error);

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = (async () => {
          const { getItem: getRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.REFRESH_TOKEN);
          const refreshToken = getRefreshToken();

          if (!refreshToken) {
            const { removeItem: removeAccessToken } = useLocalStorage(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
            const { removeItem: removeRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.REFRESH_TOKEN);
            removeAccessToken();
            removeRefreshToken();
            window.location.href = "/login";
            throw new Error("No refresh token");
          }

          // baseURL = /v1/auth 이므로 "/refresh"로 호출하면 최종 /v1/auth/refresh
          const { data } = await apiAuth.post("/refresh", { refresh: refreshToken });

          const newAccessToken = (data as any)?.data?.accessToken as string;
          const newRefreshToken = (data as any)?.data?.refreshToken as string | undefined;

          if (!newAccessToken) throw new Error("No access token in refresh response");

          const { setItem: setAccessToken } = useLocalStorage(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
          setAccessToken(newAccessToken);

          if (newRefreshToken) {
            const { setItem: setRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.REFRESH_TOKEN);
            setRefreshToken(newRefreshToken);
          }

          return newAccessToken;
        })()
          .catch((err) => {
            const { removeItem: removeAccessToken } = useLocalStorage(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
            const { removeItem: removeRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.REFRESH_TOKEN);
            removeAccessToken();
            removeRefreshToken();
            window.location.href = "/login";
            throw err;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      return refreshPromise.then((newAccessToken) => {
        originalRequest.headers = originalRequest.headers ?? {};
        (originalRequest.headers as any).Authorization = `Bearer ${newAccessToken}`;
        return apiAuth.request(originalRequest);
      });
    }

    return Promise.reject(error);
  }
);
