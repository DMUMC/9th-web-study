// src/context/AuthContext.tsx
import { createContext, useContext, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { LoginFormData } from '../utils/validation'; 
import { postLogin, postLogout } from '../apis/authApi';

interface AuthContextType {
  token: string | null;
  userEmail: string | null;
  userName: string | null;
  isLoading: boolean; 
  login: (data: LoginFormData, redirectPath?: string) => Promise<void>; 
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useLocalStorage<string | null>('authToken', null);
  const [userEmail, setUserEmail] = useLocalStorage<string | null>('userEmail', null);
  const [userName, setUserName] = useLocalStorage<string | null>('userName', null);
  const [, setRefreshToken] = useLocalStorage<string | null>('refreshToken', null);
  
  const [isLoading, setIsLoading] = useState(false); 
  const navigate = useNavigate(); 

  const login = async (data: LoginFormData, redirectPath?: string) => { 
    setIsLoading(true);
    try {
      const response = await postLogin(data); 
      
      if (response.data.data.accessToken && response.data.data.refreshToken) {
        setToken(response.data.data.accessToken); 
        setRefreshToken(response.data.data.refreshToken); // 👈 2. Refresh Token 저장
        setUserEmail(data.email); 
        setUserName(response.data.data.name);
        
        navigate(redirectPath || '/mypage'); 
      } else {
        alert('로그인에 실패했습니다: 서버가 토큰을 반환하지 않았습니다.');
      }
    } catch (e: any) {
      console.error(e);
      if (e.response && e.response.data && e.response.data.message) {
        alert(`로그인 실패: ${e.response.data.message}`);
      } else {
        alert('로그인에 실패했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => { 
    setIsLoading(true);
    try {
      await postLogout(); 
    } catch (e) {
      console.error('로그아웃 API 호출 실패:', e); 
    } finally {
      setToken(null); 
      setRefreshToken(null);
      setUserEmail(null); 
      setUserName(null);
      setIsLoading(false);
      alert('로그아웃 되었습니다.');
      navigate('/');
    }
  };

  const value = { token, userEmail, userName, login, logout, isLoading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => { 
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};