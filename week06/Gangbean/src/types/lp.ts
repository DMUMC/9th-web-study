import type { CursorBasedResponse } from './common';

export type Tags = {
    id: number;
    name: string;
};

export type Likes = {
    id: number;
    userId: number;
    lpId: number;
};

export type ResponseLpListDto = CursorBasedResponse<{
    data: {
        id: number;
        title: string;
        content: string;
        thumbnail: string;
        published: boolean;
        authorId: number;
        createdAt: Date;
        updatedAt: Date;
        tags: Tags[];
        likes: Likes[];
    }[];
}>;
