import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { AddLpDto } from "../../types/lp"
import { addLp } from "../../apis/lp"
import { QUERY_KEY } from "../../constant/key"
import useLpModal from "../../store/useLpModal"

const useAddLp = () => {
    const qc = useQueryClient()
    const {setIsOpen} = useLpModal()
    return useMutation({
        mutationKey: [QUERY_KEY.addLp],
        mutationFn: (lpData: AddLpDto) => {
            return addLp(lpData)
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: [QUERY_KEY.lps] })
            setIsOpen(false)
        }
    })
}

export default useAddLp