// src/types/lp.ts
export interface Lp {
  id: number;
  title: string;
  content: string;
  authorId: number;
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  
  likes?: any[];
  tags?: { id: number; name: string }[];
  likeCount?: number;

  author?: {
    id: number;
    email: string;
    name: string;
    avatar: string | null;
    bio: string | null;
  };
}

export interface ResponseLpListDto {
  data: Lp[];
  nextCursor?: number;
}

export interface ResponseLpDetailDto {
  data: Lp;
}