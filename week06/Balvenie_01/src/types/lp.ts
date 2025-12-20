import type { CommonResponse, CursorBasedResponse } from "./common";

export type Tags = {
  id: number;
  name: string;
};

export type Likes = {
  id: number;
  userId: number;
  lpId: number;
};

export type Author = {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
};

// ✅ LP 한 개의 타입
export type LpItem = {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  published: boolean;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
  tags: Tags[];
  likes: Likes[];
};

// ✅ LP 리스트 응답
export type ResponseLpListDto = CursorBasedResponse<LpItem>;

// ✅ LP 상세 응답
export type ResponseLpDetailDto = CommonResponse<
  LpItem & {
    author: Author;
  }
>;