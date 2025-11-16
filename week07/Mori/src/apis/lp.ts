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