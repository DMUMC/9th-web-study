import { useMutation, useQueryClient } from "@tanstack/react-query"
import { MUTATION_KEY, QUERY_KEY } from "../../../constant/key"
import { likesLp } from "../../../apis/likes"
import type { ResponseLikesLp } from "../../../types/likes"

const usePostLike = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationKey: [MUTATION_KEY.postLike],
        mutationFn: (lpid: number) => likesLp(lpid),
        onSuccess: (data: ResponseLikesLp) => {
            qc.invalidateQueries({ queryKey: [QUERY_KEY.lp, data.data.lpId] })
        }
    })
}

export default usePostLike