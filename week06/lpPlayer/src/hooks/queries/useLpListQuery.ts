import { useQuery } from '@tanstack/react-query';
import { getLpList } from '../../apis/lps';

export const useLpListQuery = (order: 'asc' | 'desc') => {
  return useQuery({
    queryKey: ['lps', order],
    queryFn: () => getLpList({ order, limit: 12 }),
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
  });
};
