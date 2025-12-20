import type { CommonResponse, CursorBasedResponse } from "./common";

export interface Tag {
    id: number
    name: string
}

export interface Likes {
    id: number
    userId: number
    lpId: number
}

export interface Author {
    id: number
    name: string
    email: string
    bio: string | null
    avatar: string | null
    createdAt: Date
    updatedAt: Date
}

export interface Lp {
    id: number
    title: string
    content: string
    thumbnail: string
    published: boolean
    authorId: number
    createdAt: Date
    updatedAt: Date
    tags: Tag[]
    likes: Likes[]
    author: Author
}

export type ResponseLpListDto = CursorBasedResponse <Lp[]>

export type ResponseLpDetailDto = CommonResponse<{
    id: number
    title: string
    content: string
    thumbnail: string
    published: boolean
    authorId: number
    createdAt: Date
    updatedAt: Date
    tags: Tag[]
    likes: Likes[]
    author: Author
}>

export interface CommentDto {
    id: number
    content: string
    lpId: number
    authorId: number
    createdAt: Date
    updatedAt: Date
    author: Author
}

export type ResponseLpCommentsDto = CursorBasedResponse<CommentDto[]>