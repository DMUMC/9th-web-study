import { api } from './axios';
import type { LpDetailResponse, LpListResponse, LpDto } from '../types/lp';
import type { CommonResponse } from '../types/common';

type ListParams = {
  cursor?: number;
  limit?: number;
  order?: 'asc' | 'desc';
  search?: string;
};

export const getLpList = async (params: ListParams): Promise<LpListResponse> => {
  const { data } = await api.get<LpListResponse>('/lps', { params });
  return data;
};

export const getLpDetail = async (lpId: number): Promise<LpDetailResponse> => {
  const { data } = await api.get<LpDetailResponse>(`/lps/${lpId}`);
  return data;
};

export type LpPayload = {
  title: string;
  content: string;
  tags: string[];
  thumbnail: string;
  published: boolean;
};

export const postLp = async (payload: LpPayload): Promise<CommonResponse<LpDto>> => {
  const { data } = await api.post<CommonResponse<LpDto>>('/lps', payload);
  return data;
};

type UpdateLpPayload = Partial<LpPayload>;

export const patchLp = async (lpId: number, payload: UpdateLpPayload): Promise<CommonResponse<LpDto>> => {
  const { data } = await api.patch<CommonResponse<LpDto>>(`/lps/${lpId}`, payload);
  return data;
};

export const deleteLp = async (lpId: number): Promise<CommonResponse<{ success: boolean }>> => {
  const { data } = await api.delete<CommonResponse<{ success: boolean }>>(`/lps/${lpId}`);
  return data;
};

export const likeLp = async (lpId: number): Promise<CommonResponse<{ success: boolean }>> => {
  const { data } = await api.post<CommonResponse<{ success: boolean }>>(`/lps/${lpId}/likes`);
  return data;
};

export const unlikeLp = async (lpId: number): Promise<CommonResponse<{ success: boolean }>> => {
  const { data } = await api.delete<CommonResponse<{ success: boolean }>>(`/lps/${lpId}/likes`);
  return data;
};
