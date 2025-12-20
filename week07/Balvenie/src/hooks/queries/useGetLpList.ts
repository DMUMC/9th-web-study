import { useQuery } from '@tanstack/react-query';
import type { PaginationDto } from '../../types/common'; // 요청 파라미터 타입 임포트
import { QUERY_KEY } from '../../key'; // 쿼리 키 상수 임포트
import { getLPList } from '../../apis/lp'; // API 요청 함수 임포트
import { PAGINATION_ORDER } from '../../enums/common';
import type { ResponseLpListDto } from '../../types/lp';

/**
 * LP(Long Play) 목록을 조회하고 Tanstack Query로 관리하는 커스텀 훅입니다.
 * @param cursor 현재 페이지 커서
 * @param search 검색어
 * @param order 정렬 순서
 * @param limit 페이지당 항목 수
 * @returns useQueryResult 객체 (data, isLoading, isError 등 포함)
 */
function useGetLpList({ cursor, search, order, limit }: PaginationDto) {
    const sortOrder = order ?? PAGINATION_ORDER.DESC;
    const safeCursor = cursor ?? 0;
    const safeLimit = limit ?? 12;

    return useQuery<ResponseLpListDto>({
        queryKey: [QUERY_KEY.lps, sortOrder, safeCursor, safeLimit, search ?? ''],
        queryFn: () =>
            getLPList({
                cursor: safeCursor,
                search,
                order: sortOrder,
                limit: safeLimit,
            }),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        keepPreviousData: true,
    });
}

export default useGetLpList;