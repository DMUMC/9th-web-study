import { useMutation } from "@tanstack/react-query"
import { MUTATION_KEY } from "../../../constant/key"
import { deleteUser } from "../../../apis/auth"
import { useLocalStorage } from "../../useLocalStorage"
import { LOCAL_STORAGE_KEY } from "../../../constant/key"

export const useDeleteUser = () => {
    const { removeItem: removeAccessTokenStorage } = useLocalStorage(LOCAL_STORAGE_KEY.ACCESS_TOKEN)
    const { removeItem: removeRefreshTokenStorage } = useLocalStorage(LOCAL_STORAGE_KEY.REFRESH_TOKEN)
    return useMutation({
        mutationKey: [MUTATION_KEY.deleteUser],
        mutationFn: () => deleteUser(),
        onSuccess: () => {
            alert('회원탈퇴에 성공했습니다.')
            removeAccessTokenStorage()
            removeRefreshTokenStorage()
            window.location.href = '/'
        },
        onError: () => {
            alert('회원탈퇴에 실패했습니다.')
        },
    })
}