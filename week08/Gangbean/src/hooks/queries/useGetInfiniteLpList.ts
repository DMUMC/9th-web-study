import { useInfiniteQuery } from '@tanstack/react-query';
import { getLpList } from '../../apis/lp';
import { QUERY_KEY } from '../../constants/key';

function useGetInfiniteLpList(
    limit: number,
    search: string,
    order: 'asc' | 'desc',
    enabled: boolean = true
) {
    return useInfiniteQuery({
        queryKey: [QUERY_KEY.lps, search, order],
        queryFn: ({ pageParam }) =>
            getLpList({ cursor: pageParam, limit, search, order }),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPage) => {
            return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
        },
        enabled,
        staleTime: 5 * 60 * 1000, // 5분간 데이터를 fresh로 유지
        gcTime: 10 * 60 * 1000, // 10분간 캐시 유지 (이전 cacheTime)
    });
}

export default useGetInfiniteLpList;
