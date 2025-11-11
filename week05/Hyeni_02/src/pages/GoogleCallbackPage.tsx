// src/pages/GoogleCallbackPage.tsx (최종 수정본)
import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getMyInfo } from '../apis/authApi';

export const GoogleCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [, setToken] = useLocalStorage<string | null>('authToken', null);
  const [, setRefreshToken] = useLocalStorage<string | null>('refreshToken', null);
  const [, setUserName] = useLocalStorage<string | null>('userName', null);
  const [, setUserEmail] = useLocalStorage<string | null>('userEmail', null);

  useEffect(() => {
    const handleLoginCallback = async () => {
      const accessToken = searchParams.get('accessToken');
      const refreshToken = searchParams.get('refreshToken');
      const name = searchParams.get('name');

      if (accessToken && refreshToken && name) {
        setToken(accessToken);
        setRefreshToken(refreshToken);
        setUserName(name);

        try {
          const userInfoResponse = await getMyInfo();
          
          if (userInfoResponse.data && userInfoResponse.data.data.email) {
            setUserEmail(userInfoResponse.data.data.email);
          } else {
            console.warn('getMyInfo API 응답에 이메일이 없습니다.');
          }

          navigate('/mypage');

        } catch (error) {
          console.error('소셜 로그인 후 getMyInfo 호출에 실패했습니다:', error);
          navigate('/mypage');
        }

      } else {
        alert('소셜 로그인에 실패했습니다. (필수 정보 누락)');
        navigate('/login');
      }
    };

    handleLoginCallback();
    
  }, [searchParams, navigate, setToken, setRefreshToken, setUserName, setUserEmail]);

  return (
    <div className='p-8 text-white w-full max-w-md text-center'>
      <p className='text-2xl font-bold'>구글 로그인 처리 중...</p>
      <p>잠시만 기다려주세요. (사용자 정보 조회 중...)</p>
    </div>
  );
};