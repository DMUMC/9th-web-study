// src/context/AuthContext.tsx (수정)
import { createContext, useContext, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { LoginFormData } from '../utils/validation'; 
import { postLogin, postLogout } from '../apis/authApi';

interface AuthContextType {
  token: string | null;
  userEmail: string | null;
  isLoading: boolean; 
  login: (data: LoginFormData, redirectPath?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useLocalStorage<string | null>('authToken', null);
  const [userEmail, setUserEmail] = useLocalStorage<string | null>('userEmail', null);
  const [isLoading, setIsLoading] = useState(false); 
  const navigate = useNavigate();

  const login = async (data: LoginFormData, redirectPath?: string) => {
    setIsLoading(true);
    try {
      const response = await postLogin(data);

      if (response.data.accessToken) {
        setToken(response.data.accessToken);
        setUserEmail(data.email); 
        
        navigate(redirectPath || '/mypage');
      } else {
        alert('로그인에 실패했습니다: 토큰이 없습니다.');
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
      setUserEmail(null);
      setIsLoading(false);
      alert('로그아웃 되었습니다.');
      navigate('/');
    }
  };

  const value = { token, userEmail, login, logout, isLoading }; 

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};