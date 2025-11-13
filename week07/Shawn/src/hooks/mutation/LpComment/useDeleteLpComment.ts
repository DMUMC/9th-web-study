import { useMutation, useQueryClient } from "@tanstack/react-query"
import { QUERY_KEY } from "../../../constant/key"
import { deleteLpComment } from "../../../apis/lp"

const useDeleteLpComment = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationKey: [QUERY_KEY.deleteLpComment],
        mutationFn: ({lpid, commentId}: {lpid: number, commentId: number}) => deleteLpComment(lpid, commentId),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: [QUERY_KEY.lpComments] })
        }
    })
}

export default useDeleteLpComment