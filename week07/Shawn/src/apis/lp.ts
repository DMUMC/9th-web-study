import type { PaginationDto } from "../types/common";
import type { AddLpCommentDto, AddLpDto, ResponseAddLpCommentDto, ResponseAddLpDto, ResponseDeleteLpCommentDto, ResponseLpCommentsDto, ResponseLpDetailDto, ResponseLpListDto, ResponseUpdateLpCommentDto } from "../types/lp";
import { api } from "../utils/AxiosInstance";

export const getLpList = async (paginationDto: PaginationDto):Promise<ResponseLpListDto> => {
    const {data} = await api.get('/lps', {
        params: paginationDto
    })

    return data
}

export const getLpDetail = async (lpid: number):Promise<ResponseLpDetailDto> => {
    const {data} = await api.get(`/lps/${lpid}`)

    return data
}

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

export const addLp = async (lpData: AddLpDto):Promise<ResponseAddLpDto> => {
    const {data} = await api.post('/lps', lpData)

    return data
}