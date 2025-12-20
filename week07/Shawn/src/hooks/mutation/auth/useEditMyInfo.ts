import { useMutation, useQueryClient } from "@tanstack/react-query"
import { editMyInfo } from "../../../apis/auth"
import { QUERY_KEY } from "../../../constant/key"
import type { ResponseMyInfoDto } from "../../../types/auth"
import type { RequestEditMyInfoDto } from "../../../types/auth"

export const useEditMyInfo = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationKey: ['editMyInfo'],
        mutationFn: (body: RequestEditMyInfoDto) => editMyInfo(body),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: [QUERY_KEY.myinfo] })
        },
        onMutate: async (body: RequestEditMyInfoDto) => {
            await qc.cancelQueries({ queryKey: [QUERY_KEY.myinfo] })

            const previousMyInfo = qc.getQueryData<ResponseMyInfoDto>([QUERY_KEY.myinfo])

            const newMyInfo = {...previousMyInfo} as ResponseMyInfoDto

            newMyInfo.data.name = body.name
            newMyInfo.data.bio = body.bio
            newMyInfo.data.avatar = body.avatar ?? null

            qc.setQueryData([QUERY_KEY.myinfo], newMyInfo)

            return { previousMyInfo, newMyInfo }
        },

        onError: (error, _, context) => {
            console.error(error)
            qc.setQueryData([QUERY_KEY.myinfo], context?.previousMyInfo)
        },

        onSettled: async () => {
            await qc.invalidateQueries({ queryKey: [QUERY_KEY.myinfo] })
        }
    })
}