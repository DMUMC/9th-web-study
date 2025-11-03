// src/apis/auth.ts
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
  // ✅ users는 /v1/users/me (절대 URL로 호출)
  const url = `${import.meta.env.VITE_API_URL}/v1/users/me`;

  // (기존 로직 유지: 토큰을 꺼내서 헤더에 실어주지만,
  // 인터셉터가 자동으로 Authorization를 붙여주므로 없어도 동작합니다)
  const raw = localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
  const token = raw ? JSON.parse(raw) : null;

  const { data } = await apiAuth.get(url, {
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
  // ✅ users는 /v1/users (절대 URL로 호출)
  const url = `${import.meta.env.VITE_API_URL}/v1/users`;

  const raw = localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
  const token = raw ? JSON.parse(raw) : null;

  const form = new FormData();
  form.append("avatar", file);

  const { data } = await apiAuth.patch(url, form, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};
