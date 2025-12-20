import { useMutation } from '@tanstack/react-query';
import { postSignin } from '../../apis/auth';
import type { RequestSignupDto } from '../../types/auth';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { LOCAL_STORAGE_KEY } from '../../key';
import { useNavigate, useLocation } from 'react-router-dom';

const useSignin = () => {
    const { setItem: setAccessToken } = useLocalStorage(
        LOCAL_STORAGE_KEY.accessToken
    );
    const { setItem: setRefreshToken } = useLocalStorage(
        LOCAL_STORAGE_KEY.refreshToken
    );
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const redirectTo = params.get('redirect');

    return useMutation({
        mutationFn: (body: RequestSignupDto) => postSignin(body),
        onSuccess: (data) => {
            const { accessToken, refreshToken } = data.data;
            // 토큰 저장
            setAccessToken(accessToken);
            setRefreshToken(refreshToken);
            // 리다이렉트
            window.location.href = redirectTo ?? '/my';
        },
    });
};

export default useSignin;