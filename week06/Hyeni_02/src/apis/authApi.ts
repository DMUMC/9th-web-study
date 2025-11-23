// src/apis/authApi.ts
import type { LoginFormData, SignupFormData } from '../utils/validation';
import { axiosInstance } from './axios';

export const postSignup = (data: Omit<SignupFormData, 'confirmPassword'>) => {
  return axiosInstance.post('/auth/signup', data);
};

export const postLogin = (data: LoginFormData) => {
  return axiosInstance.post('/auth/signin', data); 
};

export const postLogout = () => {
  return axiosInstance.post('/auth/signout'); 
};

export const getMyInfo = () => {
  return axiosInstance.get('/users/me'); 
};