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