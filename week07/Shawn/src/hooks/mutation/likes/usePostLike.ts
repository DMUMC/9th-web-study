import { useMutation, useQueryClient } from "@tanstack/react-query"
import { MUTATION_KEY, QUERY_KEY } from "../../../constant/key"
import { likesLp } from "../../../apis/likes"
import type { ResponseLpDetailDto } from "../../../types/lp"
import type { ResponseMyInfoDto } from "../../../types/auth"

const usePostLike = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationKey: [MUTATION_KEY.postLike],
        mutationFn: (lpid: number) => likesLp(lpid),
        onMutate: async (lpid: number) => {
            await qc.cancelQueries({ queryKey: [QUERY_KEY.lp, lpid] })

            const previousLp = qc.getQueryData<ResponseLpDetailDto>([QUERY_KEY.lp, lpid])

            const newLp = {...previousLp}

            const me = qc.getQueryData<ResponseMyInfoDto>([QUERY_KEY.myinfo])

            const userId = Number(me?.data.id)

            const likedIndex = previousLp?.data.likes.findIndex((like) => like.userId === userId) ?? -1

            if (likedIndex >= 0) {
                previousLp?.data.likes.splice(likedIndex, 1)
            } else {
                const newLike = {userId, lpid:lpid} as Likes
                previousLp?.data.likes.push(newLike)
            }

            qc.setQueryData([QUERY_KEY.lp, lpid], newLp)

            return { previousLp, newLp }
        },

        onError: (error, lpid, context) => {
            console.error(error)
            qc.setQueryData([QUERY_KEY.lp, lpid], context?.previousLp?.data.id)
        },

        onSettled: async (data, error, lpid, context) => {
            await qc.invalidateQueries({ queryKey: [QUERY_KEY.lp, lpid] })
        }
    })
}

export default usePostLike