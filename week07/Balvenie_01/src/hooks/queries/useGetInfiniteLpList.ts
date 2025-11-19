import { useInfiniteQuery } from '@tanstack/react-query';
import type { PaginationDto } from '../../types/common';
import { QUERY_KEY } from '../../key';
import { getLPList } from '../../apis/lp';
import type { ResponseLpListDto } from '../../types/lp';

function useGetInfiniteLpList({
    search,
    order,
    limit = 12,
}: Omit<PaginationDto, 'cursor'>) {
    return useInfiniteQuery({
        queryKey: [QUERY_KEY.lps, 'infinite', search, order, limit],
        queryFn: ({ pageParam = 0 }) =>
            getLPList({
                cursor: pageParam as number,
                search,
                order,
                limit,
            }),
        getNextPageParam: (lastPage: ResponseLpListDto) => {
            if (lastPage.data.hasNext && lastPage.data.nextCursor !== null) {
                return lastPage.data.nextCursor;
            }
            return undefined;
        },
        initialPageParam: 0,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}

export default useGetInfiniteLpList;