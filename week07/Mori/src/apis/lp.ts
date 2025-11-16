import type {
  LpOrder,
  ResponseLpCommentListDto,
  ResponseLpDetailDto,
  ResponseLpListDto,
} from "../types/lp"
import type { CommonResponse } from "../types/common"
import { axiosInstance } from "./axios"

interface GetLpListParams {
  cursor?: number
  limit?: number
  search?: string
  order?: LpOrder
}

export const getLpList = async (params: GetLpListParams = {}): Promise<ResponseLpListDto> => {
  const { data } = await axiosInstance.get<ResponseLpListDto>("/v1/lps", {
    params,
  })

  return data
}

export const getLpDetail = async (lpId: number): Promise<ResponseLpDetailDto> => {
  const { data } = await axiosInstance.get<ResponseLpDetailDto>(`/v1/lps/${lpId}`)
  return data
}

interface GetLpCommentsParams {
  cursor?: number
  limit?: number
  order?: LpOrder
}

export const getLpComments = async (
  lpId: number,
  params: GetLpCommentsParams = {}
): Promise<ResponseLpCommentListDto> => {
  const { data } = await axiosInstance.get<ResponseLpCommentListDto>(`/v1/lps/${lpId}/comments`, {
    params,
  })
  return data
}

// 이미지 업로드 응답 타입
interface ImageUploadData {
  imageUrl: string
}

export type ResponseImageUploadDto = CommonResponse<ImageUploadData>

// 이미지 업로드 API (비인증)
export const uploadImage = async (file: File): Promise<ResponseImageUploadDto> => {
  const formData = new FormData()
  formData.append("file", file)

  const { data } = await axiosInstance.post<ResponseImageUploadDto>("/v1/uploads/public", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return data
}

// LP 생성 파라미터 타입
interface CreateLpParams {
  title: string
  content: string
  thumbnail: string | null
  tags: string[]
  published?: boolean
}

export const createLp = async (params: CreateLpParams): Promise<ResponseLpDetailDto> => {
  const { data } = await axiosInstance.post<ResponseLpDetailDto>(
    "/v1/lps",
    {
      title: params.title,
      content: params.content,
      thumbnail: params.thumbnail || undefined,
      tags: params.tags,
      published: params.published ?? true,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
  return data
}

// 댓글 생성
interface CreateCommentParams {
  content: string
}

export type ResponseCommentDto = CommonResponse<{
  id: number
  content: string
  lpId: number
  authorId: number
  createdAt: string
  updatedAt: string
  author: {
    id: number
    name: string
    email: string
    bio: string | null
    avatar: string | null
    createdAt: string
    updatedAt: string
  }
}>

export const createComment = async (
  lpId: number,
  params: CreateCommentParams
): Promise<ResponseCommentDto> => {
  const { data } = await axiosInstance.post<ResponseCommentDto>(
    `/v1/lps/${lpId}/comments`,
    { content: params.content },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
  return data
}

// 댓글 수정
interface UpdateCommentParams {
  content: string
}

export const updateComment = async (
  lpId: number,
  commentId: number,
  params: UpdateCommentParams
): Promise<ResponseCommentDto> => {
  const { data } = await axiosInstance.patch<ResponseCommentDto>(
    `/v1/lps/${lpId}/comments/${commentId}`,
    { content: params.content },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
  return data
}

// 댓글 삭제
export const deleteComment = async (lpId: number, commentId: number): Promise<void> => {
  await axiosInstance.delete(`/v1/lps/${lpId}/comments/${commentId}`)
}

// LP 수정
interface UpdateLpParams {
  title: string
  content: string
  thumbnail?: string | null
  tags: string[]
  published?: boolean
}

export const updateLp = async (
  lpId: number,
  params: UpdateLpParams
): Promise<ResponseLpDetailDto> => {
  const { data } = await axiosInstance.patch<ResponseLpDetailDto>(
    `/v1/lps/${lpId}`,
    {
      title: params.title,
      content: params.content,
      thumbnail: params.thumbnail || undefined,
      tags: params.tags,
      published: params.published ?? true,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
  return data
}

// LP 삭제
export const deleteLp = async (lpId: number): Promise<void> => {
  await axiosInstance.delete(`/v1/lps/${lpId}`)
}

// LP 좋아요 토글
export const likeLp = async (lpId: number): Promise<ResponseLpDetailDto> => {
  const { data } = await axiosInstance.post<ResponseLpDetailDto>(`/v1/lps/${lpId}/likes`)
  return data
}

export const unlikeLp = async (lpId: number): Promise<void> => {
  await axiosInstance.delete(`/v1/lps/${lpId}/likes`)
}