import { useMutation } from "@tanstack/react-query"
import { MUTATION_KEY } from "../../../constant/key"
import type { RequestLoginDto } from "../../../types/auth"
import { postLogin } from "../../../apis/auth"
import type { ResponseLoginDto } from "../../../types/auth"
import { useLocalStorage } from "../../useLocalStorage"
import { LOCAL_STORAGE_KEY } from "../../../constant/key"
import { useQueryClient } from "@tanstack/react-query"
import { QUERY_KEY } from "../../../constant/key"

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
        onError: () => {
            alert('로그인에 실패했습니다.')
        },
    })

}