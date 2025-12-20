import { useMutation, useQueryClient } from "@tanstack/react-query"
import { QUERY_KEY } from "../../../constant/key"
import { updateLpComment } from "../../../apis/lpComment"

const useUpdateLpComment = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationKey: [QUERY_KEY.updateLpComment],
        mutationFn: ({lpid, commentId, commentData}: {lpid: number, commentId: number, commentData: string}) => updateLpComment(lpid, commentId, commentData),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: [QUERY_KEY.lpComments] })
        }
    })
}

export default useUpdateLpComment