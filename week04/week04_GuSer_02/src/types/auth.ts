import type { CommonResponse } from "./common"

export interface RequestSignupDto {
    name: string
    email: string
    password: string
}

export type ResponseSignupDto = CommonResponse<{
    id: number
    name: string
    email: string
    bio: string | null
    avatar: string | null
    createdAt: Date
    updatedAt: Date
}>

export interface RequestLoginDto {
    email: string
    password: string
}

export type ResponseLoginDto = CommonResponse<{
    id: number
    name: string
    accessToken: string
    refreshToken: string
}>

export type ResponseMyInfoDto = CommonResponse<{
    id: number
    name: string
    email: string
    bio: string | null
    avatar: string | null
    createdAt: Date
    updatedAt: Date
}>
