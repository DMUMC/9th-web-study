// src/apis/authApi.ts
import type { LoginFormData, SignupFormData } from '../utils/validation';
import { api } from './axios'; // 님의 'apis' 폴더에 있는 axios 인스턴스

// 1. 회원가입 API (JSON - 이미 성공)
export const postSignup = (data: Omit<SignupFormData, 'confirmPassword'>) => {
  return api.post('/auth/signup', data);
};

// 2. 로그인 API (JSON - "다른 분들"과 동일하게 수정)
export const postLogin = (data: LoginFormData) => {
  // -----------------------------------------------------------------
  // 👇 "다른 분들"의 코드와 동일하게 JSON(data)을 직접 보냅니다.
  // -----------------------------------------------------------------
  return api.post('/auth/signin', data); 
};

// 3. 로그아웃 API
export const postLogout = () => {
  return api.post('/auth/signout'); 
};

// 4. 내 정보 가져오기 API (인터셉터가 토큰을 처리)
export const getMyInfo = () => {
  return api.get('/users/me'); 
};