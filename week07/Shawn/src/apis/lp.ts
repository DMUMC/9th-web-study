import type { PaginationDto } from "../types/common";
import type { AddLpDto, ResponseAddLpDto, ResponseLpDetailDto, ResponseLpListDto } from "../types/lp";
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