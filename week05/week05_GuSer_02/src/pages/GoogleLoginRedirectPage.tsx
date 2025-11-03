import { useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { LOCAL_STORAGE_KEY } from '../constant/key';

const GoogleLoginRedirectPage = () => {
  // ✅ useLocalStorage는 인자 1개만! (키만 전달)
  const { setItem: setAccessToken }  = useLocalStorage(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
  const { setItem: setRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.REFRESH_TOKEN);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    // ✅ 콜백 URL의 실제 쿼리 키 이름으로 읽기 (스샷 기준)
    // 예: /v1/auth/google/callback?userId=...&name=...&accessToken=...&refreshToken=...
    const ACCESS_TOKEN  = urlParams.get('accessToken');   // string | null
    const REFRESH_TOKEN = urlParams.get('refreshToken');  // string | null

    // ✅ 두 토큰이 모두 있을 때만 저장 → setItem(string) 타입 OK
    if (ACCESS_TOKEN && REFRESH_TOKEN) {
      setAccessToken(ACCESS_TOKEN);
      setRefreshToken(REFRESH_TOKEN);
      window.location.replace('/my');
    }
  }, [setAccessToken, setRefreshToken]);

  return <div />;
};

export default GoogleLoginRedirectPage;
