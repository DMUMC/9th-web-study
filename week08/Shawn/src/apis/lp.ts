import type { CommonResponse, PaginationDto } from "../types/common";
import type { AddLpDto, ResponseAddLpDto, ResponseLpDetailDto, ResponseLpListDto, ResponseUpdateLpDto } from "../types/lp";
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

export const addLp = async (lpData: AddLpDto):Promise<ResponseAddLpDto> => {
    const {data} = await api.post('/lps', lpData)

    return data
}

export const updateLp = async (lpid: number, lpData: AddLpDto):Promise<ResponseUpdateLpDto> => {
    const {data} = await api.patch(`/lps/${lpid}`, lpData)

    return data
}

export const deleteLp = async (lpid: number):Promise<CommonResponse<{ data: boolean }>> => {
    const {data} = await api.delete(`/lps/${lpid}`)

    return data
}