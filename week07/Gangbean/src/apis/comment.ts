import type { PaginationDto } from '../types/common';
import type { ResponseLpCommentListDto } from '../types/comment';
import { axiosInstance } from './axios';

export const getLpComments = async (
    lpId: number,
    paginationDto: PaginationDto
): Promise<ResponseLpCommentListDto> => {
    const { data } = await axiosInstance.get(
        `/v1/lps/${lpId}/comments`,
        {
            params: paginationDto,
        }
    );

    return data;
};
