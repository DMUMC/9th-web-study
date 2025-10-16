import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
})

// 토큰이 필요 없는 API 경로들
const PUBLIC_API_PATHS = [
  '/v1/auth/signin',
  '/v1/auth/signup',
]

axiosInstance.interceptors.request.use((config) => {
  const isPublicApi = PUBLIC_API_PATHS.some(path => config.url?.includes(path))
  
  if (!isPublicApi) {
    const token = localStorage.getItem('auth-storage')
    if (token) {
      try {
        const parsedToken = JSON.parse(token)
        if (parsedToken?.state?.accessToken) {
          config.headers.Authorization = `Bearer ${parsedToken.state.accessToken}`
        }
      } catch (error) {
        console.error('토큰 파싱 오류:', error)
      }
    }
  }
  
  return config
})