import type { PaginationDto } from '../types/common';
import type {
    RequestCreateLpDto,
    RequestUpdateLpDto,
    ResponseCreateLpDto,
    ResponseLpDetailDto,
    ResponseLpListDto,
    ResponseUpdateLpDto,
} from '../types/lp';
import { axiosInstance } from './axios';

export const getLpList = async (
    paginationDto: PaginationDto
): Promise<ResponseLpListDto> => {
    const { data } = await axiosInstance.get(`/v1/lps`, {
        params: paginationDto,
    });

    return data;
};

export const getLpDetail = async (
    lpId: number
): Promise<ResponseLpDetailDto> => {
    const { data } = await axiosInstance.get(
        `/v1/lps/${lpId}`
    );

    return data;
};

export const postCreateLp = async (
    body: RequestCreateLpDto
): Promise<ResponseCreateLpDto> => {
    const { data } = await axiosInstance.post(
        `/v1/lps`,
        body
    );

    return data;
};

export const patchUpdateLp = async (
    lpId: number,
    body: RequestUpdateLpDto
): Promise<ResponseUpdateLpDto> => {
    const { data } = await axiosInstance.patch(
        `/v1/lps/${lpId}`,
        body
    );

    return data;
};

export const deleteLp = async (
    lpId: number
): Promise<void> => {
    await axiosInstance.delete(`/v1/lps/${lpId}`);
};
