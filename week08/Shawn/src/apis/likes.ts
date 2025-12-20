import type { ResponseLikesLp } from "../types/likes"
import { api } from "../utils/AxiosInstance"

export const likesLp = async (lpid: number):Promise<ResponseLikesLp> => {
    const {data} = await api.post(`/lps/${lpid}/likes`)

    return data
}

export const deleteLikesLp = async (lpid: number):Promise<ResponseLikesLp> => {
    const {data} = await api.delete(`/lps/${lpid}/likes`)

    return data
}