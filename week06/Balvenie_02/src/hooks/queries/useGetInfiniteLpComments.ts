import { useInfiniteQuery } from '@tanstack/react-query';
import { getLpComments } from '../../apis/lp';
import { QUERY_KEY } from '../../key';

function useGetInfiniteLpComments(
    lpId: number | undefined,
    limit: number,
    order: 'asc' | 'desc'
) {
    return useInfiniteQuery({
        enabled: typeof lpId === 'number',
        queryKey: [QUERY_KEY.lpComments, lpId, order],
        queryFn: ({ pageParam }) =>
            getLpComments(lpId as number, {
                cursor: pageParam,
                limit,
                order,
            }),
        initialPageParam: 0,
        getNextPageParam: (lastPage) =>
            lastPage.data.hasNext
                ? lastPage.data.nextCursor
                : undefined,
    });
}

export default useGetInfiniteLpComments;