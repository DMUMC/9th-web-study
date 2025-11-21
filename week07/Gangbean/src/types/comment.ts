import type { CursorBasedResponse } from './common';
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
