import axios from "axios";
import { postRefreshToken } from "./auth";
import { useAuthStore } from "../store/authStore";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
})

// 토큰이 필요 없는 API 경로
const PUBLIC_API_PATHS = [
  '/v1/auth/signin',
  '/v1/auth/signup',
  '/v1/auth/refresh',
]

// 토큰 갱신 확인
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: string) => void
  reject: (error?: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(token || undefined)
    }
  })
  
  failedQueue = []
}

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

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return axiosInstance(originalRequest)
        }).catch(err => {
          return Promise.reject(err)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const authStorage = localStorage.getItem('auth-storage')
        if (authStorage) {
          const parsedAuth = JSON.parse(authStorage)
          const refreshToken = parsedAuth?.state?.refreshToken

          if (refreshToken) {
            const response = await postRefreshToken(refreshToken)
            const { accessToken, refreshToken: newRefreshToken } = response.data
            console.log('새로운 토큰 발급 완료:', { accessToken: accessToken?.substring(0, 20) + '...', refreshToken: newRefreshToken?.substring(0, 20) + '...' })

            const updatedAuth = {
              ...parsedAuth,
              state: {
                ...parsedAuth.state,
                accessToken,
                refreshToken: newRefreshToken
              }
            }
            localStorage.setItem('auth-storage', JSON.stringify(updatedAuth))
            useAuthStore.getState().updateTokens(accessToken, newRefreshToken)

            processQueue(null, accessToken)

            originalRequest.headers.Authorization = `Bearer ${accessToken}`
            return axiosInstance(originalRequest)
          }
        }
        } catch (refreshError) {
          processQueue(refreshError, null)
          localStorage.removeItem('auth-storage')
          useAuthStore.getState().setLogout()
          window.location.href = '/login'
          return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)