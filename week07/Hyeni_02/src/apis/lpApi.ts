// src/apis/lpApi.ts
import type { PaginationDto } from '../types/common';
import type {
  ResponseLpDetailDto,
  ResponseLpListDto,
} from '../types/lp';
import { axiosInstance } from './axios';

export const getLpList = async (
  params: PaginationDto
): Promise<ResponseLpListDto & { nextCursor?: number }> => {
  const { data } = await axiosInstance.get(`/lps`, {
    params: params, 
  });

  return data;
};

export const getLpDetail = async (
  lpId: number
): Promise<ResponseLpDetailDto> => {
  const { data } = await axiosInstance.get(
    `/lps/${lpId}`
  );

  return data;
};

export const getLpComments = async (
  lpId: number,
  params: PaginationDto
): Promise<any> => {
  const { data } = await axiosInstance.get(`/lps/${lpId}/comments`, {
    params,
  });
  return data;
};

interface CreateLpDto {
  title: string;
  content: string;
  thumbnail: string;
  tags: string[];
  published: boolean;
}

export const postLp = async (data: CreateLpDto) => {
  const response = await axiosInstance.post('/lps', data);
  return response.data;
};

export const patchLp = async (lpId: number, data: { title: string; content: string; thumbnail: string; tags: string[]; published: boolean }) => {
  const { data: response } = await axiosInstance.patch(`/lps/${lpId}`, data);
  return response;
};

export const deleteLp = async (lpId: number) => {
  const { data } = await axiosInstance.delete(`/lps/${lpId}`);
  return data;
};

export const postComment = async (lpId: number, content: string) => {
  const { data } = await axiosInstance.post(`/lps/${lpId}/comments`, { content });
  return data;
};

export const patchComment = async (lpId: number, commentId: number, content: string) => {
  const { data } = await axiosInstance.patch(`/lps/${lpId}/comments/${commentId}`, { content });
  return data;
};

export const deleteComment = async (lpId: number, commentId: number) => {
  const { data } = await axiosInstance.delete(`/lps/${lpId}/comments/${commentId}`);
  return data;
};

export const postLike = async (lpId: number) => {
  const { data } = await axiosInstance.post(`/lps/${lpId}/likes`);
  return data;
};

export const deleteLike = async (lpId: number) => {
  const { data } = await axiosInstance.delete(`/lps/${lpId}/likes`);
  return data;
};