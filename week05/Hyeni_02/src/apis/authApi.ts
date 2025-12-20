// src/apis/authApi.ts
import type { LoginFormData, SignupFormData } from '../utils/validation';
import { api } from './axios';

// 1. 회원가입 API
export const postSignup = (data: Omit<SignupFormData, 'confirmPassword'>) => {
  return api.post('/auth/signup', data);
};

// 2. 로그인 API
export const postLogin = (data: LoginFormData) => {
  return api.post('/auth/signin', data); 
};

// 3. 로그아웃 API
export const postLogout = () => {
  return api.post('/auth/signout'); 
};

// 4. 내 정보 가져오기 API
export const getMyInfo = () => {
  return api.get('/users/me'); 
};