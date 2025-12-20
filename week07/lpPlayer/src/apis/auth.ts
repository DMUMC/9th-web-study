import axios from "axios";
import type {
  RequestSigninDto,
  RequestSignupDto,
  ResponseDeleteAccountDto,
  ResponseMyInfoDto,
  ResponseProfileUpdateDto,
  ResponseSigninDto,
  ResponseSignoutDto,
  ResponseSignupDto,
  UpdateProfilePayload,
} from "../types/auth";
import { api as axiosInstance } from "./axios"; // <- 파일명/경로 확인

export const postSignup = async (body: RequestSignupDto): Promise<ResponseSignupDto> => {
  const { data } = await axiosInstance.post("/auth/signup", body);
  return data;
};

export const postSignin = async (body: RequestSigninDto): Promise<ResponseSigninDto> => {
  const { data } = await axiosInstance.post("/auth/signin", body);
  return data;
};

export const postRefreshToken = async (refreshToken: string): Promise<ResponseSigninDto> => {
  const { data } = await axiosInstance.post("/auth/refresh", { refresh: refreshToken });
  return data;
};

// getMyInfo는 헤더를 직접 넣지 않아도 인터셉터가 붙여줌
export const getMyInfo = async (): Promise<ResponseMyInfoDto> => {
  const { data } = await axiosInstance.get("/users/me");
  return data;
};

export const patchMyInfo = async (payload: UpdateProfilePayload): Promise<ResponseProfileUpdateDto> => {
  try {
    const { data } = await axiosInstance.patch<ResponseProfileUpdateDto>("/users", payload);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      const { data } = await axiosInstance.patch<ResponseProfileUpdateDto>("/users/me", payload);
      return data;
    }
    throw error;
  }
};

export const postSignout = async (): Promise<ResponseSignoutDto> => {
  const { data } = await axiosInstance.post<ResponseSignoutDto>("/auth/signout");
  return data;
};

export const deleteAccount = async (): Promise<ResponseDeleteAccountDto> => {
  try {
    const { data } = await axiosInstance.delete<ResponseDeleteAccountDto>("/users");
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      const { data } = await axiosInstance.delete<ResponseDeleteAccountDto>("/users/me");
      return data;
    }
    throw error;
  }
};
