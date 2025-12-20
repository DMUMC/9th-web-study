import { useMutation, useQueryClient } from "@tanstack/react-query"
import { MUTATION_KEY, QUERY_KEY } from "../../../constant/key"
import { updateLp } from "../../../apis/lp"
import type { AddLpDto } from "../../../types/lp"
import type { ResponseUpdateLpDto } from "../../../types/lp"

const useUpdateLp = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationKey: [MUTATION_KEY.updateLp],
        mutationFn: ({lpid, lpData}: {lpid: number, lpData: AddLpDto}) => updateLp(lpid, lpData),
		onSuccess: (data: ResponseUpdateLpDto) => {
			qc.invalidateQueries({ queryKey: [QUERY_KEY.lp, data.data.id] })
            alert('LP 수정에 성공했습니다.')
        },
        onError: () => {
            alert('LP 수정에 실패했습니다.')
        }
	})
}

export default useUpdateLp