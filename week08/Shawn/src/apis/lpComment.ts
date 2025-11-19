import { api } from "../utils/AxiosInstance"
import type { PaginationDto } from "../types/common"
import type { ResponseLpCommentsDto } from "../types/lp"
import type { AddLpCommentDto } from "../types/lp"
import type { ResponseAddLpCommentDto } from "../types/lp"
import type { ResponseUpdateLpCommentDto } from "../types/lp"
import type { ResponseDeleteLpCommentDto } from "../types/lp"

export const getLpComments = async (lpid: number, paginationDto: PaginationDto):Promise<ResponseLpCommentsDto> => {
    const {data} = await api.get(`/lps/${lpid}/comments`, {
        params: paginationDto
    })

    return data
}

export const addLpComment = async (lpid: number, commentData: AddLpCommentDto):Promise<ResponseAddLpCommentDto> => {
    const {data} = await api.post(`/lps/${lpid}/comments`, commentData)

    return data
}

export const updateLpComment = async (lpid: number, commentId: number, commentData: string):Promise<ResponseUpdateLpCommentDto> => {
    const {data} = await api.patch(`/lps/${lpid}/comments/${commentId}`, commentData)

    return data
}

export const deleteLpComment = async (lpid: number, commentId: number):Promise<ResponseDeleteLpCommentDto> => {
    const {data} = await api.delete(`/lps/${lpid}/comments/${commentId}`)

    return data
}