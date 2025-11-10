// src/pages/GoogleCallbackPage.tsx
import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const GoogleCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [, setToken] = useLocalStorage<string | null>('authToken', null);
  const [, setRefreshToken] = useLocalStorage<string | null>('refreshToken', null);
  const [, setUserName] = useLocalStorage<string | null>('userName', null);
  const [, setUserEmail] = useLocalStorage<string | null>('userEmail', null);

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const name = searchParams.get('name');
    const email = searchParams.get('email');

    if (accessToken && refreshToken && name && email) {
      setToken(accessToken);
      setRefreshToken(refreshToken);
      setUserName(name);
      setUserEmail(email);

      navigate('/mypage');
    } else {
      alert('소셜 로그인에 실패했습니다. 다시 시도해주세요.');
      navigate('/login');
    }
    
  }, [searchParams, navigate, setToken, setRefreshToken, setUserName, setUserEmail]);

  return (
    <div className='p-8 text-white w-full max-w-md text-center'>
      <p className='text-2xl font-bold'>구글 로그인 처리 중...</p>
      <p>잠시만 기다려주세요.</p>
    </div>
  );
};