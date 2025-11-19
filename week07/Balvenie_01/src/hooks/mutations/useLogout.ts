import { useMutation } from '@tanstack/react-query';
import { postLogout } from '../../apis/auth';
import { useAuth } from '../../AuthContext';

const useLogout = () => {
    const { logout } = useAuth();

    return useMutation({
        mutationFn: () => postLogout(),
        onSuccess: async () => {
            await logout();
        },
        onError: async () => {
            // 에러가 발생해도 로컬에서 로그아웃 처리
            await logout();
        },
    });
};

export default useLogout;