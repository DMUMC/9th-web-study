import { api } from './axios';
import type { CommentListResponse } from '../types/comment';

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
