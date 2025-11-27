import axiosInstance from './axiosInstance';
import type { UserSigninInformation, UserSignupInformation } from '../utils/validate';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    nickname: string;
    profileImage?: string;
  };
}

export interface User {
  id: number;
  email: string;
  nickname: string;
  bio?: string;
  profileImage?: string;
}

export const postLogin = async (data: UserSigninInformation): Promise<AuthResponse> => {
  const response = await axiosInstance.post('/v1/auth/signin', {
    email: data.email,
    password: data.password,
  });
  // 서버 응답 구조에 따라 조정
  // 만약 서버가 { data: { accessToken, refreshToken, user } } 형태로 반환한다면 response.data.data
  // 만약 서버가 { accessToken, refreshToken, user } 형태로 반환한다면 response.data
  return response.data;
};

export const postSignup = async (data: Omit<UserSignupInformation, 'passwordConfirm'>): Promise<AuthResponse> => {
  const response = await axiosInstance.post('/v1/auth/signup', {
    email: data.email,
    password: data.password,
    nickname: data.nickname,
  });
  // 서버 응답 구조에 따라 조정
  return response.data;
};

export const postRefreshToken = async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
  const response = await axiosInstance.post('/v1/auth/refresh', { refreshToken });
  return response.data;
};

export const getMe = async (): Promise<User> => {
  const response = await axiosInstance.get('/v1/users/me');
  return response.data;
};

export const patchUser = async (data: Partial<Omit<User, 'profileImage'>> & { profileImage?: File }): Promise<User> => {
  const formData = new FormData();
  
  if (data.nickname) formData.append('nickname', data.nickname);
  if (data.bio !== undefined) formData.append('bio', data.bio);
  if (data.profileImage) formData.append('profileImage', data.profileImage);

  const response = await axiosInstance.patch('/v1/users/me', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteUser = async (): Promise<void> => {
  await axiosInstance.delete('/v1/users/me');
};

export const postLogout = async (): Promise<void> => {
  await axiosInstance.post('/v1/auth/logout');
};

export const getGoogleAuthUrl = (): string => {
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/v1/auth/google`;
};

