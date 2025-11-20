import axios, { type InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEY } from '../key';
import { useLocalStorage } from '../hooks/useLocalStorage'; // useLocalStorage 훅에서 헬퍼 함수들을 가져오기 위해 사용

// -----------------------------------------------------------------------
// 1. 모듈 레벨 설정 (전역 변수처럼 사용)
// -----------------------------------------------------------------------

// 🔑 useLocalStorage 훅을 호출하여 토큰 관리 함수들을 가져옴
// (주의: 인터셉터 밖 모듈 레벨에서 호출하여 React Hook 규칙 위반을 피함)
const { getItem: getRefreshToken, removeItem: removeRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
const { setItem: setAccessToken, setItem: setRefreshToken, removeItem: removeAccessToken } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);

// 갱신 중복 방지를 위한 Promise 변수 (토큰 갱신 요청이 이미 진행 중인지 확인하는 '진행 중' 플래그)
let refreshPromise: Promise<string | null> | null = null; 

// 요청 설정을 확장하여 재시도 여부를 기록하는 플래그를 추가
interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean; // 재시도 여부를 기록하는 플래그
}

// Axios 인스턴스 생성 (모든 요청의 기본 주소 설정)
export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_API_URL,
});

// -----------------------------------------------------------------------
// 2. 요청 인터셉터 (Interceptor): 요청이 서버로 가기 전에 토큰 부착
// -----------------------------------------------------------------------
axiosInstance.interceptors.request.use(
    (config) => {
        // 로컬 저장소에서 Access Token을 가져옴
        const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);

        // Access Token이 있다면, 요청 헤더에 'Authorization: Bearer [토큰]' 형식으로 부착
        if (accessToken) {
            config.headers = config.headers || {}; 
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config; // 수정된 설정을 반환하여 서버로 요청을 보냄
    },
    (error) => {
        return Promise.reject(error);
    }
);

// -----------------------------------------------------------------------
// 3. 응답 인터셉터: 응답을 받은 후 401 에러를 잡아서 토큰을 갱신
// -----------------------------------------------------------------------
axiosInstance.interceptors.response.use(
    (response) => {
        return response; // 성공적인 응답은 그대로 통과
    },
    async (error) => {
        // 원래 요청의 설정을 가져옴 (재시도 플래그 확인용)
        const originalRequest = error.config as CustomInternalAxiosRequestConfig;

        if (error.response) {
            // 401 Unauthorized 에러가 났고, 아직 재시도하지 않은 요청이라면
            if (error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true; // 재시도 플래그를 true로 설정

                // 🚨 토큰 갱신 요청('/v1/auth/refresh') 자체가 401을 받으면: 리프레시 토큰도 만료된 것이므로
                if(originalRequest.url === '/v1/auth/refresh') {
                    removeAccessToken();   // 모든 토큰 삭제
                    removeRefreshToken();
                    window.location.href = '/login'; // 로그인 페이지로 강제 이동
                    return Promise.reject(error);
                }
                
                // 🚀 토큰 갱신 로직 시작: '진행 중' 플래그가 false일 때만 새 요청 시작
                if(!refreshPromise){
                    // refreshPromise에 갱신 작업을 할당 (비동기 즉시 실행 함수)
                    refreshPromise = (async () => {
                        try {
                            const refreshToken = getRefreshToken(); // 리프레시 토큰 가져오기
                            
                            // 서버에 갱신 요청을 보내 새 Access/Refresh 토큰을 받아옴
                            const {data} = await axiosInstance.post('/v1/auth/refresh', {
                                refreshToken: refreshToken
                            });

                            setAccessToken(data.accessToken);  // 새 Access Token 저장
                            setRefreshToken(data.refreshToken); // 새 Refresh Token 저장
                            
                            // 새 Access Token을 반환하여 이후의 재시도 요청들이 사용할 수 있도록 함
                            return data.accessToken; 

                        } catch (e) {
                            // 갱신 실패 (예: 리프레시 토큰이 무효화된 경우) 시 로그아웃 처리
                            removeAccessToken();
                            removeRefreshToken();
                            window.location.href = '/login';
                            return Promise.reject(e);
                        } finally {
                            // 갱신 시도가 성공하거나 실패하거나, 작업이 끝나면 '진행 중' 플래그를 해제
                            refreshPromise = null;
                        }
                    })(); // 즉시 실행
                }
                
                // 갱신된 새 토큰을 기다림 (만약 이미 갱신 중이었다면, 그 작업이 끝날 때까지 대기)
                const newAccessToken = await refreshPromise;
                
                // 갱신된 새 토큰으로 원래 요청의 헤더를 업데이트
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                
                // 원래 실패했던 요청을 다시 시도하고 그 결과를 반환
                return axiosInstance(originalRequest);
            }
        }

        return Promise.reject(error); // 401이 아니거나 이미 재시도한 요청의 실패는 그대로 에러를 반환
    }
);