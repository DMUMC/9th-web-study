import { LOCAL_STORAGE_KEY } from "../constant/key";
import type { RequestEditMyInfoDto, RequestLoginDto, RequestSignupDto, ResponseEditMyInfoDto, ResponseLoginDto, ResponseMyInfoDto, ResponseSignupDto } from "../types/auth";
import { api } from "../utils/AxiosInstance";

export const postSignup = async (body: RequestSignupDto):Promise<ResponseSignupDto> => {
    const {data} = await api.post('/auth/signup', body)

    return data
}

export const postLogin = async (body: RequestLoginDto):Promise<ResponseLoginDto> => {
    const {data} = await api.post('/auth/signin', body)

    return data
}

export const postLogout = async () => {
    const {data} = await api.post('/auth/signout')

    return data
}

export const getMyInfo = async ():Promise<ResponseMyInfoDto> => {
    const {data} = await api.get('/users/me', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN)}`
            }
        }
    )

    return data
}

export const editMyInfo = async (body: RequestEditMyInfoDto):Promise<ResponseEditMyInfoDto> => {
    const {data} = await api.patch('/users', body)

    return data
}

export const deleteUser = async () => {
    const {data} = await api.delete('/users')

    return data
}