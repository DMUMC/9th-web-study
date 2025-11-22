import { useInfiniteQuery } from '@tanstack/react-query';
import type { PaginationDto } from '../../types/common';
import { QUERY_KEY } from '../../constant/key';
import { getLPList } from '../../apis/lp';
import type { ResponseLPListDto } from '../../types/lp';

function useGetInfiniteLpList({
    search,
    order,
    limit = 12,
}: Omit<PaginationDto, 'cursor'>) {
    // 빈 문자열/공백만 입력일 때 요청이 나가지 않도록 enabled 옵션 설정
    // search가 빈 문자열('')일 때만 false, undefined이거나 값이 있을 때는 true
    const enabled = search !== '';

    return useInfiniteQuery({
        queryKey: [QUERY_KEY.lps, 'infinite', search, order, limit],
        queryFn: ({ pageParam = 0 }) =>
            getLPList({
                cursor: pageParam as number,
                search,
                order,
                limit,
            }),
        getNextPageParam: (lastPage: ResponseLPListDto) => {
            if (lastPage.data.hasNext && lastPage.data.nextCursor !== null) {
                return lastPage.data.nextCursor;
            }
            return undefined;
        },
        initialPageParam: 0,
        enabled, // 빈 검색어일 땐 쿼리가 실행되지 않도록 설정
        staleTime: 5 * 60 * 1000, // 5분
        gcTime: 10 * 60 * 1000, // 10분 (이전 cacheTime)
    });
}

export default useGetInfiniteLpList;

