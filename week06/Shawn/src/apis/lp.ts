import type { PaginationDto } from "../types/common";
import type { ResponseLpCommentsDto, ResponseLpDetailDto, ResponseLpListDto } from "../types/lp";
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