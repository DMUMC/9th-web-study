import type {
  LpOrder,
  ResponseLpCommentListDto,
  ResponseLpDetailDto,
  ResponseLpListDto,
} from "../types/lp"
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
