import axiosInstance from './axiosInstance';

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    nickname: string;
    profileImage?: string;
  };
}

export interface CommentListResponse {
  comments: Comment[];
  nextCursor?: string;
  hasNext: boolean;
}

export interface CreateCommentData {
  content: string;
}

export interface UpdateCommentData {
  content: string;
}

export const getComments = async (
  lpId: number,
  cursor?: string,
  order: 'asc' | 'desc' = 'desc'
): Promise<CommentListResponse> => {
  const params = new URLSearchParams();
  if (cursor) params.append('cursor', cursor);
  params.append('order', order);

  const response = await axiosInstance.get(`/v1/lps/${lpId}/comments?${params.toString()}`);
  return response.data;
};

export const createComment = async (lpId: number, data: CreateCommentData): Promise<Comment> => {
  const response = await axiosInstance.post(`/v1/lps/${lpId}/comments`, data);
  return response.data;
};

export const updateComment = async (lpId: number, commentId: number, data: UpdateCommentData): Promise<Comment> => {
  const response = await axiosInstance.patch(`/v1/lps/${lpId}/comments/${commentId}`, data);
  return response.data;
};

export const deleteComment = async (lpId: number, commentId: number): Promise<void> => {
  await axiosInstance.delete(`/v1/lps/${lpId}/comments/${commentId}`);
};

