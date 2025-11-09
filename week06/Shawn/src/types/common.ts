export interface CommonResponse<T> {
    status: boolean
    statusCode: number
    message: string
    data: T
}

export interface CursorBasedResponse<T> {
    status: boolean
    statusCode: number
    message: string
    data: {
        data: T
        nextCursor: number
        hasNext: boolean
    }
}

export interface PaginationDto {
    cursor?: number
    limit?: number
    search?: string
    order?: 'asc' | 'desc'
}