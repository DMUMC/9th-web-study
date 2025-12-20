import { LOCAL_STORAGE_KEY } from "../constant/key";
import type {
  RequestLoginDto,
  RequestSignupDto,
  ResponseLoginDto,
  ResponseMyInfoDto,
  ResponseSignupDto,
} from "../types/auth";
import { apiAuth } from "../utils/AxiosInstance";

export const postSignup = async (body: RequestSignupDto): Promise<ResponseSignupDto> => {
  const { data } = await apiAuth.post("/signup", body);
  return data;
};

export const postLogin = async (body: RequestLoginDto): Promise<ResponseLoginDto> => {
  const { data } = await apiAuth.post("/signin", body);
  return data;
};

export const getMyInfo = async (): Promise<ResponseMyInfoDto> => {
  // JSON.stringify로 저장된 토큰 파싱
  const raw = localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
  const token = raw ? JSON.parse(raw) : null;

  const { data } = await apiAuth.get("/users/me", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return data;
};

export const postLogout = async () => {
  const { data } = await apiAuth.post("/signout");
  return data;
};

/** ✅ 아바타(프로필 이미지) 업로드 */
export const updateMyAvatar = async (file: File): Promise<ResponseMyInfoDto> => {
  const raw = localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
  const token = raw ? JSON.parse(raw) : null;

  const form = new FormData();
  form.append("avatar", file); // 서버가 기대하는 필드명이 'avatar'라고 가정

  const { data } = await apiAuth.patch("/users", form, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

