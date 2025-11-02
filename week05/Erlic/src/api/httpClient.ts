import axios, {
  AxiosError,
  AxiosHeaders,
} from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
} from "../constants/auth";
import {
  readStorage,
  removeStorage,
  writeStorage,
} from "../utils/storage";

type RefreshResponse = {
  accessToken: string;
  refreshToken?: string;
};

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshPromise: Promise<string | null> | null = null;

function setAuthorizationHeader(
  config: InternalAxiosRequestConfig,
  token: string,
) {
  if (!config.headers) {
    config.headers = new AxiosHeaders();
  }

  if (config.headers instanceof AxiosHeaders) {
    config.headers.set("Authorization", `Bearer ${token}`);
  } else {
    // Axios might sometimes treat headers as a plain object
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
}

function getAccessToken() {
  return readStorage<string>(ACCESS_TOKEN_KEY);
}

function getRefreshToken() {
  return readStorage<string>(REFRESH_TOKEN_KEY);
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return null;
  }

  try {
    const { data } = await refreshClient.post<RefreshResponse>(
      "/v1/auth/refresh",
      { refreshToken },
    );

    if (!data?.accessToken) {
      return null;
    }

    writeStorage(ACCESS_TOKEN_KEY, data.accessToken);

    if (data.refreshToken) {
      writeStorage(REFRESH_TOKEN_KEY, data.refreshToken);
    }

    return data.accessToken;
  } catch (error) {
    console.error("[auth] Failed to refresh access token", error);
    return null;
  }
}

function queueTokenRefresh() {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

function clearAuthState() {
  removeStorage(ACCESS_TOKEN_KEY);
  removeStorage(REFRESH_TOKEN_KEY);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("auth:logout"));
  }
}

httpClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    setAuthorizationHeader(config, token);
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalRequest = error.config as RetriableRequestConfig | undefined;

    if (status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      const newToken = await queueTokenRefresh();

      if (newToken) {
        setAuthorizationHeader(originalRequest, newToken);
        return httpClient(originalRequest);
      }

      clearAuthState();

      if (typeof window !== "undefined") {
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  },
);

export { httpClient };
