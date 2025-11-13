import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { AddLpCommentDto } from "../../../types/lp"
import { addLpComment } from "../../../apis/lp"
import { QUERY_KEY } from "../../../constant/key"

const useAddLpComment = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({lpid, commentData}: {lpid: number, commentData: AddLpCommentDto}) => addLpComment(lpid, commentData),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: [QUERY_KEY.lpComments] })
        }
    })
}

export default useAddLpComment