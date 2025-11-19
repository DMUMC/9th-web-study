import { api } from './axios';
import type { CommentDeleteResponse, CommentListResponse, CommentResponse } from '../types/comment';

type CommentListParams = {
  lpId: number;
  cursor?: number;
  limit?: number;
  order?: 'asc' | 'desc';
};

export const getLpComments = async ({ lpId, ...params }: CommentListParams): Promise<CommentListResponse> => {
  const { data } = await api.get<CommentListResponse>(`/lps/${lpId}/comments`, { params });
  return data;
};

type CreateCommentPayload = {
  lpId: number;
  content: string;
};

export const postLpComment = async ({ lpId, content }: CreateCommentPayload): Promise<CommentResponse> => {
  const { data } = await api.post<CommentResponse>(`/lps/${lpId}/comments`, { content });
  return data;
};

type UpdateCommentPayload = {
  lpId: number;
  commentId: number;
  content: string;
};

export const patchLpComment = async ({
  lpId,
  commentId,
  content,
}: UpdateCommentPayload): Promise<CommentResponse> => {
  const { data } = await api.patch<CommentResponse>(`/lps/${lpId}/comments/${commentId}`, { content });
  return data;
};

type DeleteCommentPayload = {
  lpId: number;
  commentId: number;
};

export const deleteLpComment = async ({ lpId, commentId }: DeleteCommentPayload): Promise<CommentDeleteResponse> => {
  const { data } = await api.delete<CommentDeleteResponse>(`/lps/${lpId}/comments/${commentId}`);
  return data;
};
