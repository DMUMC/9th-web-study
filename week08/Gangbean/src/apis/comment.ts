import type { PaginationDto } from '../types/common';
import type {
    LpComment,
    RequestCreateLpCommentDto,
    RequestUpdateLpCommentDto,
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

export const updateLpComment = async (
    body: RequestUpdateLpCommentDto
): Promise<LpComment> => {
    const { data } = await axiosInstance.patch(
        `/v1/lps/${body.lpId}/comments/${body.commentId}`,
        { content: body.content }
    );
    return data;
};

export const deleteLpComment = async (
    lpId: number,
    commentId: number
): Promise<void> => {
    await axiosInstance.delete(
        `/v1/lps/${lpId}/comments/${commentId}`
    );
};
