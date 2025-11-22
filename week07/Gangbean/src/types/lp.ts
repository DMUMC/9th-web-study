import type {
    CommonResponse,
    CursorBasedResponse,
} from './common';

export type Tags = {
    id: number;
    name: string;
};

export type Likes = {
    id: number;
    userId: number;
    lpId: number;
};

export type Author = {
    id: number;
    name: string;
    email: string;
    bio: string | null;
    avatar: string | null;
    createdAt: Date;
    updatedAt: Date;
};

export type Lp = {
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
};

export type ResponseLpListDto = CursorBasedResponse<Lp[]>;

export type ResponseLpDetailDto = CommonResponse<{
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
    author: Author;
}>;

export type RequestCreateLpDto = {
    title: string;
    content: string;
    thumbnail?: string;
    tags: string[];
    published: boolean;
};

export type ResponseCreateLpDto = CommonResponse<{
    id: number;
    title: string;
    content: string;
    thumbnail: string;
    published: boolean;
    authorId: number;
    createdAt: Date;
    updatedAt: Date;
}>;

export type RequestUpdateLpDto = {
    title: string;
    content: string;
    thumbnail?: string;
    tags: string[];
    published: boolean;
};

export type ResponseUpdateLpDto = CommonResponse<{
    id: number;
    title: string;
    content: string;
    thumbnail: string;
    published: boolean;
    authorId: number;
    createdAt: Date;
    updatedAt: Date;
    tags: Tags[];
}>;
