import { useInfiniteQuery } from "@tanstack/react-query"
import { getLpComments } from "../../apis/lp"
import { QUERY_KEY } from "../../constant/key"

function useGetInfiniteLpComment(lpId: number, limit: number, search: string, order: 'asc' | 'desc') {
    return useInfiniteQuery({
        queryFn: ({pageParam}) => getLpComments(lpId, {cursor: pageParam, limit, search, order}),
        queryKey: [QUERY_KEY.lpComments, lpId, order],
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            return lastPage?.data?.hasNext ? lastPage.data.nextCursor : undefined
        }
    })
}

export default useGetInfiniteLpComment