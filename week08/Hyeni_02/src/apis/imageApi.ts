// src/apis/imageApi.ts
import { axiosInstance } from './axios';

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file); 

  const { data } = await axiosInstance.post('/uploads', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return data; 
};