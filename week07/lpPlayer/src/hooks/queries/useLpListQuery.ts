import { useInfiniteQuery } from '@tanstack/react-query';
import { getLpList } from '../../apis/lps';

export const useLpListQuery = (order: 'asc' | 'desc') => {
  return useInfiniteQuery({
    queryKey: ['lps', order],
    initialPageParam: undefined as number | undefined,
    queryFn: ({ pageParam }) => getLpList({ order, limit: 12, cursor: pageParam ?? undefined }),
    getNextPageParam: (lastPage) => {
      if (!lastPage?.data?.hasNext) return undefined;
      return lastPage.data.nextCursor ?? undefined;
    },
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
  });
};
