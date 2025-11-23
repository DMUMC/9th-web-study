export type CommonResponse<T> = {
    status: boolean;
    statusCode: number;
    message: string;
    data: T;
};

export type CursorPayload<T> = {
    data: T;
    nextCursor: number | null;
    hasNext: boolean;
};

export type CursorBasedResponse<T> = CommonResponse<{
    data: T;
    nextCursor: number | null;
    hasNext: boolean;
}>;

export type PaginationDto = {
    cursor?: number;
    limit?: number;
    search?: string;
    order?: 'asc' | 'desc';
};

