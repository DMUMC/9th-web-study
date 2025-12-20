
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constant/key";
import { useInfiniteQuery } from "@tanstack/react-query";

function useGetInfiniteLpList(limit: number, search: string, order: 'asc' | 'desc') {
    return useInfiniteQuery({
        queryFn: ({pageParam}) => getLpList({cursor: pageParam, limit, search, order}),
        queryKey: [QUERY_KEY.lps, order, search],
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            return lastPage?.data?.hasNext ? lastPage.data.nextCursor : undefined
        }
    })
}

export default useGetInfiniteLpList