import type {
  RequestSigninDto, RequestSignupDto,
  ResponseMyInfoDto, ResponseSigninDto, ResponseSignupDto
} from "../types/auth";
import { axiosInstance } from "./axios"; // <- 파일명/경로 확인

export const postSignup = async (body: RequestSignupDto): Promise<ResponseSignupDto> => {
  const { data } = await axiosInstance.post("/v1/auth/signup", body);
  return data;
};

export const postSignin = async (body: RequestSigninDto): Promise<ResponseSigninDto> => {
  const { data } = await axiosInstance.post("/v1/auth/signin", body);
  return data;
};

export const postRefreshToken = async (refreshToken: string): Promise<ResponseSigninDto> => {
  const { data } = await axiosInstance.post("/v1/auth/refresh", { refresh: refreshToken });
  return data;
};

// getMyInfo는 헤더를 직접 넣지 않아도 인터셉터가 붙여줌
export const getMyInfo = async (): Promise<ResponseMyInfoDto> => {
  const { data } = await axiosInstance.get("/v1/users/me");
  return data;
};