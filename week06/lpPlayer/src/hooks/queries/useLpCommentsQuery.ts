import { useInfiniteQuery } from '@tanstack/react-query';
import { getLpComments } from '../../apis/comments';

export const useLpCommentsQuery = (lpId: number | null, order: 'asc' | 'desc') => {
  return useInfiniteQuery({
    queryKey: ['lpComments', lpId, order],
    initialPageParam: undefined as number | undefined,
    queryFn: ({ pageParam }) => {
      if (!lpId) throw new Error('LP id is missing');
      return getLpComments({ lpId, order, limit: 6, cursor: pageParam ?? undefined });
    },
    enabled: Boolean(lpId),
    getNextPageParam: (lastPage) => {
      if (!lastPage?.data?.hasNext) return undefined;
      return lastPage.data.nextCursor ?? undefined;
    },
    staleTime: 1000 * 15,
    gcTime: 1000 * 60 * 5,
  });
};
