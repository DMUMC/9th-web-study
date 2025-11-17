import { useMutation, useQueryClient } from '@tanstack/react-query'
import { MUTATION_KEY, QUERY_KEY, LOCAL_STORAGE_KEY } from '../../../constant/key'
import { postLogin } from '../../../apis/auth'
import type { RequestLoginDto, ResponseLoginDto } from '../../../types/auth'
import { useLocalStorage } from '../../useLocalStorage'
import axios from 'axios'

export const useLogin = () => {
	const { setItem: setAccessTokenStorage } = useLocalStorage(LOCAL_STORAGE_KEY.ACCESS_TOKEN)
	const { setItem: setRefreshTokenStorage } = useLocalStorage(LOCAL_STORAGE_KEY.REFRESH_TOKEN)
	const qc = useQueryClient()

	return useMutation<ResponseLoginDto, unknown, RequestLoginDto>({
		mutationKey: [MUTATION_KEY.login],
		mutationFn: (body: RequestLoginDto) => postLogin(body),
		onSuccess: (data: ResponseLoginDto) => {
			setAccessTokenStorage(data.data.accessToken)
			setRefreshTokenStorage(data.data.refreshToken)
			qc.invalidateQueries({ queryKey: [QUERY_KEY.myinfo] })
			window.location.href = '/'
		},
		onError: (error) => {
			const message = axios.isAxiosError(error) ? (error.response?.data?.message as string | undefined) ?? '로그인에 실패했습니다.' : '로그인에 실패했습니다.'
			alert(message)
		},
	})
}