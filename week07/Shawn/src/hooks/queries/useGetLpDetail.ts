import { useQuery } from "@tanstack/react-query"
import { getLpDetail } from "../../apis/lp"
import { QUERY_KEY } from "../../constant/key"

const useGetLpDetail = ({lpid}: {lpid: number}) => {
    return useQuery({
        queryKey: [QUERY_KEY.lp, lpid],
        queryFn: () => getLpDetail(lpid),
    })
}

export default useGetLpDetail