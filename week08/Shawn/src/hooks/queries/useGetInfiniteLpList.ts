import { getLpList } from '../../apis/lp'
import { QUERY_KEY } from '../../constant/key'
import { useInfiniteQuery } from '@tanstack/react-query'

function useGetInfiniteLpList(limit: number, search: string, order: 'asc' | 'desc') {
	// 빈 문자열이나 공백만 있는 경우 검색어를 빈 문자열로 처리
	const trimmedSearch = search?.trim() || ''
	// 빈 검색어일 때는 search 파라미터를 undefined로 전달 (전체 목록 조회)
	const searchParam = trimmedSearch.length > 0 ? trimmedSearch : undefined

	return useInfiniteQuery({
		queryFn: ({ pageParam }) => getLpList({ cursor: pageParam, limit, search: searchParam, order }),
		queryKey: [QUERY_KEY.lps, order, trimmedSearch],
		initialPageParam: 0,
		enabled: true, // 항상 쿼리 실행 (빈 검색어일 때도 전체 목록 조회)
		getNextPageParam: (lastPage) => {
			return lastPage?.data?.hasNext ? lastPage.data.nextCursor : undefined
		},
		staleTime: 5 * 60 * 1000, // 5분간 데이터를 fresh로 유지
		gcTime: 10 * 60 * 1000, // 10분간 캐시 유지 (이전 cacheTime)
	})
}

export default useGetInfiniteLpList
