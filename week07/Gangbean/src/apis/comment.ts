import type { PaginationDto } from '../types/common';
import type {
    LpComment,
    RequestCreateLpCommentDto,
    ResponseLpCommentListDto,
} from '../types/comment';
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

export const postLpComment = async (
    body: RequestCreateLpCommentDto
): Promise<LpComment> => {
    const { data } = await axiosInstance.post(
        `/v1/lps/${body.lpId}/comments`,
        { content: body.content }
    );
    return data;
};
