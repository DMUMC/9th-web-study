import { useMutation, useQueryClient } from "@tanstack/react-query"
import { editMyInfo } from "../../../apis/auth"
import { QUERY_KEY } from "../../../constant/key"
import type { RequestEditMyInfoDto } from "../../../types/auth"

export const useEditMyInfo = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationKey: ['editMyInfo'],
        mutationFn: (body: RequestEditMyInfoDto) => editMyInfo(body),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: [QUERY_KEY.myinfo] })
        },
    })
}