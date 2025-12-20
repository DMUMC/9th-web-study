import { useInfiniteQuery } from '@tanstack/react-query';
import { getLpList } from '../../apis/lps';

type UseLpListQueryOptions = {
  search?: string;
  enabled?: boolean;
};

export const useLpListQuery = (order: 'asc' | 'desc', options: UseLpListQueryOptions = {}) => {
  const normalizedSearch = options.search?.trim() ?? '';
  const shouldApplySearch = normalizedSearch.length > 0;

  return useInfiniteQuery({
    queryKey: ['lps', order, 'search', shouldApplySearch ? normalizedSearch : 'all'],
    initialPageParam: undefined as number | undefined,
    queryFn: ({ pageParam }) =>
      getLpList({
        order,
        limit: 12,
        cursor: pageParam ?? undefined,
        search: shouldApplySearch ? normalizedSearch : undefined,
      }),
    enabled: options.enabled ?? (!options.search || shouldApplySearch),
    getNextPageParam: (lastPage) => {
      if (!lastPage?.data?.hasNext) return undefined;
      return lastPage.data.nextCursor ?? undefined;
    },
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,
  });
};
