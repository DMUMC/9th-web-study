import type { ResponseImageUploadDto } from '../types/upload';
import { axiosInstance } from './axios';

export const postImageUpload = async (
    file: File
): Promise<ResponseImageUploadDto> => {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await axiosInstance.post(
        `/v1/uploads`,
        formData
    );

    return data;
};
