// src/context/AutoContext.tsx
import { createContext, useContext, useState, type ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { LoginFormData } from '../utils/validation'; 
import { postLogin, postLogout, getMyInfo } from '../apis/authApi';

interface AuthContextType {
  token: string | null;
  userEmail: string | null;
  userName: string | null;
  userId: number | null;
  isLoading: boolean; 
  login: (data: LoginFormData, redirectPath?: string) => Promise<void>; 
  logout: () => void;
  updateUserInfo: (newName: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useLocalStorage<string | null>('authToken', null);
  const [userEmail, setUserEmail] = useLocalStorage<string | null>('userEmail', null);
  const [userName, setUserName] = useLocalStorage<string | null>('userName', null);
  const [userId, setUserId] = useLocalStorage<number | null>('userId', null);
  const [, setRefreshToken] = useLocalStorage<string | null>('refreshToken', null);
  
  const [isLoading, setIsLoading] = useState(false); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchMe = async () => {
        if (token && (!userId || !userName)) {
            try {
                const { data } = await getMyInfo();
                const userInfo = data.data?.data || data.data || data; 
                
                if (userInfo) {
                    if (userInfo.id) setUserId(userInfo.id);
                    if (userInfo.email) setUserEmail(userInfo.email);
                    if (userInfo.name) setUserName(userInfo.name);
                }
            } catch (e) {
                console.error("내 정보 복구 실패", e);
            }
        }
    };
    fetchMe();
  }, [token, userId, userName, setUserId, setUserEmail, setUserName]);

  const login = async (data: LoginFormData, redirectPath?: string) => { 
    setIsLoading(true);
    try {
      const response = await postLogin(data); 
      
      if (response.data.data.accessToken) {
        const responseData = response.data.data;

        setToken(responseData.accessToken); 
        if(responseData.refreshToken) {
            setRefreshToken(responseData.refreshToken);
        }
        setUserEmail(data.email); 
        setUserName(responseData.name);
        
        if (responseData.id) {
            setUserId(responseData.id);
        }
        
        navigate(redirectPath || '/mypage'); 
      }
    } catch (e: any) {
      console.error(e);
      alert('로그인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => { 
    setIsLoading(true);
    try {
      await postLogout(); 
    } catch (e) {
      console.error('로그아웃 실패:', e); 
    } finally {
      setToken(null); 
      setRefreshToken(null);
      setUserEmail(null); 
      setUserName(null);
      setUserId(null);
      setIsLoading(false);
      navigate('/login');
    }
  };

  const updateUserInfo = (newName: string) => {
      console.log("Context: 닉네임 업데이트 실행됨 ->", newName);
      setUserName(newName); 
  };

  const value = { token, userEmail, userName, userId, login, logout, updateUserInfo, isLoading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => { 
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};