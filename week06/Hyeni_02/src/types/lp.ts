// src/types/lp.ts
export interface Lp {
  id: number;
  title: string;
  content: string;
  authorId?: number;
  thumbnail: string;
  createdAt: string;
  likes?: any[];
  tags?: any[];
  likeCount?: number;
}

export interface ResponseLpListDto {
  data: Lp[];
}

export interface ResponseLpDetailDto {
  data: Lp;
}