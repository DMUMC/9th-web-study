// src/hooks/useGetLpList.ts (또는 유사한 파일)

import { useQuery } from '@tanstack/react-query';
import type { PaginationDto } from '../../types/common'; // 요청 파라미터 타입 임포트
import { QUERY_KEY } from '../../constant/key'; // 쿼리 키 상수 임포트
import { getLPList } from '../../apis/lp'; // API 요청 함수 임포트

/**
 * LP(Long Play) 목록을 조회하고 Tanstack Query로 관리하는 커스텀 훅입니다.
 * @param cursor 현재 페이지 커서
 * @param search 검색어
 * @param order 정렬 순서
 * @param limit 페이지당 항목 수
 * @returns useQueryResult 객체 (data, isLoading, isError 등 포함)
 */
function useGetLpList({ cursor, search, order, limit }: PaginationDto) {
    //  useQuery 훅 반환
    return useQuery({
        // Query Key: 캐싱 및 Refetch 식별자.
        // 여기서는 LP 목록 전체를 대표하는 상수를 사용합니다.
        queryKey: [QUERY_KEY.lps, cursor, search, order, limit],

        // Query Function: 실제 API 호출 로직을 정의합니다.
        queryFn: () =>
            getLPList({
                cursor,
                search,
                order,
                limit,
            }),

        // 여기에 staleTime, gcTime, enabled 등 추가 옵션이 들어갈 수 있습니다.
        // 이 시간동안은 캐시된 데이터를 그대로 사용합니다. 컴포넌트가 마운트 되거나 포커스 될 때 재요청하지 않습니다.
        // 5분동안 기존 데이터를 그대로 활용해서 네트워크 요청을 줄임
        staleTime: 5 * 60 * 1000, // 데이터 신선도 유지 시간 (5분)
            
        // 사용하지 않는 캐시 데이터를 메모리에서 제거하는 시간.
        // 10분 동안 사용되지 않은 캐시 데이터는 메모리에서 제거됩니다.
        // staleTime이 지나고 데이터가 신선하지 않더라도 일정 시간 동안 메모리에 보관.
        // 예) 10분 동안 사용되지 않으면 해당 캐시 데이터가 삭제되어, 다음 요청 시 새로 데이터를 받아오게 됩니다.
        gcTime: 10 * 60 * 1000, // 가비지 컬렉션 시간 (10분)

        // enabled: Boolean(true), // 쿼리 활성화 여부 (기본값: true)

        // refetchInterval: 10 * 60, // 10분마다 백그라운드에서 자동으로 데이터 갱신

        // retry: 1, // 네트워크 오류 시 재시도 횟수 설정 (기본값: 3)

        // keepPreviousData: true, // 페이지네이션 시 이전 데이터를 유지하여 UI 깜빡임 방지

        
    });
}

export default useGetLpList;
