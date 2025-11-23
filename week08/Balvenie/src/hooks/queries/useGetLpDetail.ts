import { useQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '../../key';
import { getLPDetail } from '../../apis/lp';
import type { ResponseLpDetailDto } from '../../types/lp';

function useGetLpDetail(lpId: string | undefined) {
    return useQuery({
        queryKey: [QUERY_KEY.lps, 'detail', lpId],
        queryFn: () => {
            if (!lpId) {
                throw new Error('LP ID is required');
            }
            return getLPDetail(lpId);
        },
        enabled: !!lpId,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}

export default useGetLpDetail;