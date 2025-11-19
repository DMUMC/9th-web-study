import type { CommonResponse } from './common';
import type { AuthorDto } from './lp';

export type CommentDto = {
  id: number;
  content: string;
  lpId: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author: AuthorDto;
};

export type CommentListResponse = CommonResponse<{
  data: CommentDto[];
  nextCursor: number | null;
  hasNext: boolean;
}>;

export type CommentResponse = CommonResponse<CommentDto>;
export type CommentDeleteResponse = CommonResponse<{ success: boolean }>;
