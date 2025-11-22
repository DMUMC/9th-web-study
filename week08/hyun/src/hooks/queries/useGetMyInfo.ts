import { useQuery } from '@tanstack/react-query';
import { getMyInfo } from '../../apis/auth';
import { useAuth } from '../../context/AuthContext';

const useGetMyInfo = () => {
    const { accessToken } = useAuth();
    
    return useQuery({
        queryKey: ['myInfo'],
        queryFn: () => getMyInfo(),
        enabled: !!accessToken, // accessToken이 있을 때만 쿼리 실행
        staleTime: 5 * 60 * 1000, // 5분
        gcTime: 10 * 60 * 1000, // 10분
        retry: false, // 401 에러 시 재시도하지 않음
    });
};

export default useGetMyInfo;

