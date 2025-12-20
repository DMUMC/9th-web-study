import { LOCAL_STORAGE_KEY } from "../constant/key";
import type {
  RequestLoginDto,
  RequestSignupDto,
  ResponseLoginDto,
  ResponseMyInfoDto,
  ResponseSignupDto
} from "../types/auth";
import { apiAuth } from "../utils/AxiosInstance";

export const postSignup = async (body: RequestSignupDto): Promise<ResponseSignupDto> => {
  const { data } = await apiAuth.post('/signup', body);
  return data;
};

export const postLogin = async (body: RequestLoginDto): Promise<ResponseLoginDto> => {
  const { data } = await apiAuth.post('/signin', body);
  return data;
};

export const getMyInfo = async (): Promise<ResponseMyInfoDto> => {
  const { data } = await apiAuth.get('/users/me');
  return data;
};