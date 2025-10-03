import { useState, useEffect } from 'react'
import { api } from '../utils/AxiosInstance'

interface UseCustomFetchState<T> {
	data: T | null
	isLoading: boolean
	error: string | null
}

interface UseCustomFetchOptions {
	enabled?: boolean
}

export const useCustomFetch = <T>(
	url: string,
	options: UseCustomFetchOptions = {}
): UseCustomFetchState<T> => {
	const [data, setData] = useState<T | null>(null)
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [error, setError] = useState<string | null>(null)

	const { enabled = true } = options

	useEffect(() => {
		if (!enabled) return

		const fetchData = async () => {
			try {
				setIsLoading(true)
				setError(null)
				const response = await api.get<T>(url)
				setData(response.data)
			} catch (err) {
				console.error(err)
				setError('데이터를 불러오는데 실패했습니다.')
			} finally {
				setIsLoading(false)
			}
		}

		fetchData()
	}, [url, enabled])

	return { data, isLoading, error }
}
