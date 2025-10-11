import axios, { type AxiosInstance } from 'axios'

export const api: AxiosInstance = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: {
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`
    }
})