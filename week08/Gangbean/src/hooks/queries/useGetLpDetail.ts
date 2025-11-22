import { useQuery } from '@tanstack/react-query';
import { getLpDetail } from '../../apis/lp';
import { QUERY_KEY } from '../../constants/key';

function useGetLpDetail(lpId?: number) {
    return useQuery({
        queryKey: [QUERY_KEY.lpDetail, lpId],
        queryFn: () => {
            if (lpId === undefined) {
                throw new Error('lpId가 필요합니다.');
            }
            return getLpDetail(lpId);
        },
        enabled: lpId !== undefined,
        select: (response) => response.data,
    });
}

export default useGetLpDetail;
