import axios from "axios";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constant/key";

export const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/v1`,
})

api.interceptors.request.use((config) => {
    const {getItem} = useLocalStorage(LOCAL_STORAGE_KEY.ACCESS_TOKEN)
    const token = getItem()

    if(token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
})