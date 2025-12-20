import { api } from './axios';
import type { LpDetailResponse, LpListResponse } from '../types/lp';

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
