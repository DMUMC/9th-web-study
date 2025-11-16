import { useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { LOCAL_STORAGE_KEY } from '../constant/key';

// 컴포넌트 이름: GoogleLoginRedirectPage.tsx
const GoogleLoginRedirectPage = () => {
    // Access Token을 로컬 저장소에 저장하는 Hook
    const { setItem: setAccessToken } = useLocalStorage(
        LOCAL_STORAGE_KEY.accessToken
    );

    // Refresh Token을 로컬 저장소에 저장하는 Hook
    const { setItem: setRefreshToken } = useLocalStorage(
        LOCAL_STORAGE_KEY.refreshToken
    );

    useEffect(() => {
        // 1. 현재 URL의 쿼리 파라미터를 가져옵니다.
        const urlParams = new URLSearchParams(window.location.search);

        // 2. URL에서 Access Token과 Refresh Token을 추출합니다.
        // 추출된 값은 문자열이거나 null일 수 있으므로 string | null로 처리합니다.
        const accessToken: string | null = urlParams.get(
            LOCAL_STORAGE_KEY.accessToken
        );
        const refreshToken: string | null = urlParams.get(
            LOCAL_STORAGE_KEY.refreshToken
        );

        // 3. 토큰이 모두 존재하는 경우 로컬 저장소에 저장하고 페이지를 이동합니다.
        if (accessToken && refreshToken) {
            setAccessToken(accessToken);
            setRefreshToken(refreshToken);

            // 로컬 저장소에 저장 후 '/my' 페이지로 이동
            window.location.href = '/my';
        }
    }, [setAccessToken, setRefreshToken]);
    // deps 배열에는 setAccessToken과 setRefreshToken 함수를 포함해야 합니다.

    return (
        <div>구글 로그인 중</div> // 처리 중임을 사용자에게 알리는 메시지
    );
};

export default GoogleLoginRedirectPage;
