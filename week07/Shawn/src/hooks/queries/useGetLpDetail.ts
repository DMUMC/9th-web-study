import { useQuery } from "@tanstack/react-query"
import { getLpDetail } from "../../apis/lp"

const useGetLpDetail = ({lpid}: {lpid: number}) => {
    return useQuery({
        queryKey: ['lp', lpid],
        queryFn: () => getLpDetail(lpid),
    })
}

export default useGetLpDetail