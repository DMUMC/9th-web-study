import {
  type RequestSignupDto,
  type RequestLoginDto,
  type ResponeSignupDto,
  type ResponeLoginDto,
  type ResponeMyInfoDto,
} from "../types/auth";
import axiosInstance from "./axios";

export const postSignup = async (
  body: RequestSignupDto
): Promise<ResponeSignupDto> => {
  const { data } = await axiosInstance.post("/v1/auth/signup", body);
  return data;
};

export const postLogin = async (
  body: RequestLoginDto
): Promise<ResponeLoginDto> => {
  const { data } = await axiosInstance.post("/v1/auth/signin", body);
  return data;
};

export const getMyinfo = async (): Promise<ResponeMyInfoDto> => {
  const { data } = await axiosInstance.get("/v1/users/me");
  return data;
};
