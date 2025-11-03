import axios from "axios";
import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios"
import { LOCAL_STORAGE_KEY } from "../constant/key";
import { useLocalStorage } from "../hooks/useLocalStorage";

// axios 요청 config에 재시도 플래그만 추가
type CustomRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  // 안전하게 쓰기 위해 선택적 url/headers를 명시
  url?: string;
  headers?: any;
};

// 전역변수: refresh 요청 Promise 저장 → 중복 방지
let refreshPromise: Promise<string> | null = null;

// =======================
// ✅ 1. Auth 경로 제외 목록
// =======================
const AUTH_PATHS = [
  "/v1/auth/signin",
  "/v1/auth/signup",
  "/v1/auth/google",
  "/v1/auth/refresh",
];

// 경로가 auth 관련인지 확인하는 함수
const isAuthPath = (url?: string) => {
  if (!url) return false;
  try {
    const path = new URL(url, "http://dummy").pathname;
    return AUTH_PATHS.includes(path);
  } catch {
    return AUTH_PATHS.some((p) => url.startsWith(p));
  }
};

// =======================
// ✅ 2. Axios 인스턴스 생성
// =======================
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL, // .env에서 읽음
});

// =======================
// ✅ 3. 요청 인터셉터
// =======================
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 로그인/회원가입/리프레시는 Authorization 헤더 제외
    if (isAuthPath(config.url)) return config;

    const { getItem } = useLocalStorage(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
    const ACCESS_TOKEN = getItem();

    if (ACCESS_TOKEN) {
      // headers가 class일 수도 있어 any로 안전하게 캐스팅
      (config.headers as any) = (config.headers as any) ?? {};
      (config.headers as any).Authorization = `Bearer ${ACCESS_TOKEN}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// =======================
// ✅ 4. 응답 인터셉터
// =======================
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomRequestConfig | undefined;
    const status = (error.response && error.response.status) || undefined;

    // 안전 가드
    if (!originalRequest || !status) return Promise.reject(error);

    // 로그인/회원가입/리프레시는 리프레시 시도 금지
    if (isAuthPath(originalRequest.url)) {
      return Promise.reject(error);
    }

    // =======================
    // ✅ 401 (토큰 만료) 처리
    // =======================
    if (status === 401 && !originalRequest._retry) {
      // refresh 자체가 실패한 경우 → 로그아웃 처리
      if (originalRequest.url === "/v1/auth/refresh") {
        const { removeItem: removeAccessToken } = useLocalStorage(
          LOCAL_STORAGE_KEY.ACCESS_TOKEN
        );
        const { removeItem: removeRefreshToken } = useLocalStorage(
          LOCAL_STORAGE_KEY.REFRESH_TOKEN
        );
        removeAccessToken();
        removeRefreshToken();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      // 재시도 플래그 설정
      originalRequest._retry = true;

      // 진행 중인 refresh 요청이 있으면 그 Promise 재사용
      if (!refreshPromise) {
        refreshPromise = (async () => {
          const { getItem: getRefreshToken } = useLocalStorage(
            LOCAL_STORAGE_KEY.REFRESH_TOKEN
          );
          const refreshToken = getRefreshToken();

          // refreshToken 없으면 즉시 로그아웃
          if (!refreshToken) {
            const { removeItem: removeAccessToken } = useLocalStorage(
              LOCAL_STORAGE_KEY.ACCESS_TOKEN
            );
            const { removeItem: removeRefreshToken } = useLocalStorage(
              LOCAL_STORAGE_KEY.REFRESH_TOKEN
            );
            removeAccessToken();
            removeRefreshToken();
            window.location.href = "/login";
            throw new Error("No refresh token");
          }

          // 새 토큰 요청
          const { data } = await axiosInstance.post("/v1/auth/refresh", {
            refresh: refreshToken,
          });

          const { setItem: setAccessToken } = useLocalStorage(
            LOCAL_STORAGE_KEY.ACCESS_TOKEN
          );
          const { setItem: setRefreshToken } = useLocalStorage(
            LOCAL_STORAGE_KEY.REFRESH_TOKEN
          );

          setAccessToken((data as any).data.accessToken);
          setRefreshToken((data as any).data.refreshToken);

          return (data as any).data.accessToken as string;
        })()
          .catch((err) => {
            // refresh 실패 → 토큰 제거 + 로그인 페이지 이동
            const { removeItem: removeAccessToken } = useLocalStorage(
              LOCAL_STORAGE_KEY.ACCESS_TOKEN
            );
            const { removeItem: removeRefreshToken } = useLocalStorage(
              LOCAL_STORAGE_KEY.REFRESH_TOKEN
            );
            removeAccessToken();
            removeRefreshToken();
            window.location.href = "/login";
            throw err; // 반드시 재던지기
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      // 진행 중인 refreshPromise 기다린 뒤, 원본 요청 재시도
      return refreshPromise.then((newAccessToken) => {
        originalRequest.headers = originalRequest.headers ?? {};
        (originalRequest.headers as any).Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance.request(originalRequest);
      });
    }

    // 그 외 에러는 그대로 반환
    return Promise.reject(error);
  }
);
