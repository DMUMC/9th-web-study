import type { CursorBasedResponse } from "./common";

export interface Tag {
    id: number
    name: string
}

export interface Likes {
    id: number
    userId: number
    lpId: number
}

export type ResponseLpListDto = CursorBasedResponse <{
    data: {
        id: number
        title: string
        content: string
        thumbnail: string
        published: boolean
        createdAt: Date
        updatedAt: Date
        tags: Tag[]
        likes: Likes[]
    }[]
}>