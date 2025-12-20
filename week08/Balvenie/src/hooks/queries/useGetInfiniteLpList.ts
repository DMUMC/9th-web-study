import { useInfiniteQuery } from '@tanstack/react-query';
import type { PaginationDto } from '../../types/common';
import { QUERY_KEY } from '../../key';
import { getLPList } from '../../apis/lp';
import type { ResponseLPListDto } from '../../types/lp';

// enabled 옵션을 받을 수 있도록 타입 확장
interface UseGetInfiniteLpListProps extends Omit<PaginationDto, 'cursor'> {
    enabled?: boolean; 
}

function useGetInfiniteLpList({
    search,
    order,
    limit = 12,
    enabled = true, // 기본값 true
}: UseGetInfiniteLpListProps) {
    return useInfiniteQuery({
        // ✅ queryKey에 지연된 값(search)이 포함됩니다. (HomePage에서 debounced value를 넘겨줌)
        queryKey: [QUERY_KEY.lps, 'infinite', search, order, limit],
        queryFn: ({ pageParam = 0 }) =>
            getLPList({
                cursor: pageParam as number,
                search,
                order,
                limit,
            }),
        // ✅ cursor 기반 페이지네이션 구현
        getNextPageParam: (lastPage: ResponseLPListDto) => {
            if (lastPage.data.hasNext && lastPage.data.nextCursor !== null) {
                return lastPage.data.nextCursor;
            }
            return undefined;
        },
        initialPageParam: 0,
        // ✅ 불필요한 재요청을 줄이기 위해 staleTime 조정 (체크리스트 반영)
        staleTime: 1 * 60 * 1000, // 1분간 데이터를 신선하게 유지 (즉시 재요청 안 함)
        gcTime: 5 * 60 * 1000,    // 5분간 캐시 유지
        enabled, // ✅ 빈 검색어일 때(또는 조건 불충족 시) 쿼리 실행 방지용
    });
}

export default useGetInfiniteLpList;