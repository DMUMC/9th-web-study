import { useQuery } from '@tanstack/react-query';
import { getLpDetail } from '../../apis/lps';

export const useLpDetailQuery = (lpId: number | null) => {
  return useQuery({
    queryKey: ['lp', lpId],
    queryFn: () => {
      if (!lpId) throw new Error('LP id is missing');
      return getLpDetail(lpId);
    },
    enabled: Boolean(lpId),
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
  });
};
