import axios, { type InternalAxiosRequestConfig } from 'axios'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { LOCAL_STORAGE_KEY } from '../constant/key'

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
	_retry?: boolean
}

let refreshPromise: Promise<string> | null = null

export const api = axios.create({
	baseURL: `${import.meta.env.VITE_API_URL}/v1`,
})

api.interceptors.request.use(
	(config) => {
		const { getItem } = useLocalStorage(LOCAL_STORAGE_KEY.ACCESS_TOKEN)
		const accessToken = getItem()

		if (accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`
		}

		return config
	},
	(error) => {
		return Promise.reject(error)
	}
)

api.interceptors.response.use(
	(response) => {
		return response
	},
	async (error) => {
		const originalRequest = error.config as CustomAxiosRequestConfig

		if (error.response && error.response.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true
			if (originalRequest.url === '/auth/refresh') {
				const { removeItem: removeAccessToken } = useLocalStorage(LOCAL_STORAGE_KEY.ACCESS_TOKEN)
				const { removeItem: removeRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.REFRESH_TOKEN)
				removeAccessToken()
				removeRefreshToken()
				window.location.href = '/login'
				return Promise.reject(error)
			}
			originalRequest._retry = true

			if (!refreshPromise) {
				refreshPromise = (async () => {
					const { getItem: getRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.REFRESH_TOKEN)
					const refreshToken = getRefreshToken()

					const { data } = await api.post('/auth/refresh', {
						refresh: refreshToken,
					})

					const { setItem: setAccessToken } = useLocalStorage(LOCAL_STORAGE_KEY.ACCESS_TOKEN)
					const { setItem: setRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.REFRESH_TOKEN)
					setAccessToken(data.data.accessToken)
					setRefreshToken(data.data.refreshToken)

					return data.data.accessToken
				})()
                .catch((err) => {
                    const { removeItem: removeAccessToken } = useLocalStorage(LOCAL_STORAGE_KEY.ACCESS_TOKEN)
                    const { removeItem: removeRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.REFRESH_TOKEN)
                    removeAccessToken()
                    removeRefreshToken()
                })
                .finally(() => {
                    refreshPromise = null
                })
			}

            return refreshPromise.then((newAccessToken) => {
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
                return api.request(originalRequest)
            })
		}

		return Promise.reject(error)
	}
)
