import type { CommonResponse } from "./common"

export type LpOrder = "asc" | "desc"

export interface LpItem {
  id: number
  title: string
  content: string
  thumbnail: string
  published: boolean
  authorId: number
  createdAt: string
  updatedAt: string
  tags: Array<{
    id: number
    name: string
  }>
  likes: Array<{
    id: number
    userId: number
    lpId: number
  }>
}

export interface LpListData {
  data: LpItem[]
  nextCursor: number | null
  hasNext: boolean
}

export type ResponseLpListDto = CommonResponse<LpListData>

export interface LpAuthor {
  id: number
  name: string
  email: string
  bio: string | null
  avatar: string | null
  createdAt: string
  updatedAt: string
}

export interface LpDetailData extends Omit<LpItem, "tags" | "likes"> {
  tags: LpItem["tags"]
  likes: LpItem["likes"]
  author: LpAuthor
}

export type ResponseLpDetailDto = CommonResponse<LpDetailData>
