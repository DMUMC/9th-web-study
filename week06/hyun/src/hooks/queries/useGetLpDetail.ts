import { useQuery } from '@tanstack/react-query';
import { getLPDetail } from '../../apis/lp';
import { QUERY_KEY } from '../../constant/key';

const useGetLpDetail = (lpId?: string) => {
    return useQuery({
        queryKey: [QUERY_KEY.lp, lpId],
        queryFn: () => {
            if (!lpId) {
                throw new Error('lpId가 필요합니다.');
            }
            return getLPDetail(lpId);
        },
        enabled: Boolean(lpId),
        staleTime: 5 * 60 * 1000,
    });
};

export default useGetLpDetail;

