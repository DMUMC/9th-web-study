import type { CommonResponse } from "../types/common"
import { api } from "../utils/AxiosInstance"

type ResponseUploadImageDto = CommonResponse<{
    imageUrl: string
}>

export const uploadImage = async (file: File): Promise<ResponseUploadImageDto> => {
    const formData = new FormData()
    formData.append('file', file)
    const {data} = await api.post('/uploads', formData)
    
    return data
}