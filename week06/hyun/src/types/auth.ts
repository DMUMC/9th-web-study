import type { CommonResponse } from "./common";

export type RequestSignupDto = {
    name: string,
    email: string,
    bio?: string,
    avatar?: string,
    password: string,
}

export type ResponseSignupDto = CommonResponse<{
    id: number;
    name: string;
    email: string;
    bio: string | null;
    avatar: string | null;
    createdAt: Date;
    updatedAt: Date;
}>;

// 로그인
export type RequestSigninDto = {
    email: string;
    password: string;
};

export type ResponseSigninDto = CommonResponse<{
    id: number;
    name: string;
    accessToken: string;
    refreshToken: string;
}>;

// 내 정보 조회
export type ResponseMyInfoDto = CommonResponse<{
    id: number;
    name: string;
    email: string;
    bio: string | null;
    avatar: string | null;
    createdAt: Date;
    updatedAt: Date;
}>

export interface UserData {
    id: number;
    email: string;
    name: string;      // 👈 환영 문구에 사용될 필드
}

export interface AuthContextType {
    accessToken: string | null;
    user: UserData | null; // 👈 사용자 데이터 객체
    login: (token: string, userData: UserData) => void;
    logout: () => void;
}