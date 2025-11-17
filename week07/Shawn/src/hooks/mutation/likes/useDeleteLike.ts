import { useMutation, useQueryClient } from "@tanstack/react-query"
import { MUTATION_KEY, QUERY_KEY } from "../../../constant/key"
import { deleteLikesLp } from "../../../apis/likes"
import type { ResponseLikesLp } from "../../../types/likes"

const useDeleteLike = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationKey: [MUTATION_KEY.deleteLike],
        mutationFn: (lpid: number) => deleteLikesLp(lpid),
        onSuccess: (data: ResponseLikesLp) => {
            qc.invalidateQueries({ queryKey: [QUERY_KEY.lp, data.data.lpId] })
        }
    })
}

export default useDeleteLike