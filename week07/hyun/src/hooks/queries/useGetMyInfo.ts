import { useQuery } from '@tanstack/react-query';
import { getMyInfo } from '../../apis/auth';

const useGetMyInfo = () => {
    return useQuery({
        queryKey: ['myInfo'],
        queryFn: () => getMyInfo(),
        staleTime: 5 * 60 * 1000, // 5분
        gcTime: 10 * 60 * 1000, // 10분
    });
};

export default useGetMyInfo;

