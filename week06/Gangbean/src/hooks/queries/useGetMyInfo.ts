import { useQuery } from '@tanstack/react-query';
import { getMyInfo } from '../../apis/auth';
import { QUERY_KEY } from '../../constants/key';

type UseGetMyInfoOptions = {
    enabled?: boolean;
};

function useGetMyInfo({
    enabled = true,
}: UseGetMyInfoOptions = {}) {
    return useQuery({
        queryKey: [QUERY_KEY.myInfo],
        queryFn: getMyInfo,
        enabled,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        select: (response) => response.data,
    });
}

export default useGetMyInfo;
