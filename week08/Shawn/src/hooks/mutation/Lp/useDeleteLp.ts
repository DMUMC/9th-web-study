import { useMutation, useQueryClient } from "@tanstack/react-query"
import { MUTATION_KEY, QUERY_KEY } from "../../../constant/key"
import { deleteLp } from "../../../apis/lp"

const useDeleteLp = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationKey: [MUTATION_KEY.deleteLp],
        mutationFn: (lpid: number) => deleteLp(lpid),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: [QUERY_KEY.lps] })
            alert('LP 삭제에 성공했습니다.')
            window.location.href = '/lps'
        },
        onError: () => {
            alert('LP 삭제에 실패했습니다.')
        }
    })
}

export default useDeleteLp