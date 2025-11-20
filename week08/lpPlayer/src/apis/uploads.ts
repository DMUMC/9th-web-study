import { api } from './axios';
import type { CommonResponse } from '../types/common';

type UploadResponse = CommonResponse<{
  imageUrl: string;
}>;

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await api.post<UploadResponse>('/uploads', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  const imageUrl = data?.data?.imageUrl;
  if (!imageUrl) {
    throw new Error('이미지 URL이 응답에 없습니다.');
  }
  return imageUrl;
};
