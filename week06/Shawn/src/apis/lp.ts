import type { PaginationDto } from "../types/common";
import type { ResponseLpListDto } from "../types/lp";
import { api } from "../utils/AxiosInstance";

export const getLpList = async (paginationDto: PaginationDto):Promise<ResponseLpListDto> => {
    const {data} = await api.get('/lps', {
        params: paginationDto
    })

    return data
}