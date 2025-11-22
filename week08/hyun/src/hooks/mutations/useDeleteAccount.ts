import { useMutation } from '@tanstack/react-query';
import { deleteAccount } from '../../apis/auth';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const useDeleteAccount = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: () => deleteAccount(),
        onSuccess: async () => {
            await logout();
            navigate('/login');
        },
        onError: (error: any) => {
            // 404 에러는 백엔드 API가 아직 구현되지 않았을 수 있음
            if (error?.response?.status === 404) {
                console.warn('탈퇴 API가 아직 구현되지 않았습니다.');
                // API가 없어도 로컬에서 로그아웃 처리
                logout();
                navigate('/login');
            }
        },
    });
};

export default useDeleteAccount;

