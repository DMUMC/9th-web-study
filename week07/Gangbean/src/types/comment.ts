import type {
    CommonResponse,
    CursorBasedResponse,
} from './common';
import type { Author } from './lp';

export type LpComment = {
    id: number;
    content: string;
    lpId: number;
    authorId: number;
    createdAt: Date;
    updatedAt: Date;
    author: Author;
};

export type ResponseLpCommentListDto = CursorBasedResponse<
    LpComment[]
>;

export type RequestCreateLpCommentDto = {
    lpId: number;
    content: string;
};

export type RequestUpdateLpCommentDto = {
    commentId: number;
    lpId: number;
    content: string;
};

export type ResponseUpdateLpCommentDto =
    CommonResponse<LpComment>;
