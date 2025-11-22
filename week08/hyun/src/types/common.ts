import { PAGINATION_ORDER } from '../enums/common';

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

export type CursorBasedResponse<T> = CommonResponse<CursorPayload<T>>;

export type PaginationDto = {
    cursor?: number; // 현재 페이지 시작 커서 (옵셔널)
    limit?: number; // 한 페이지에 표시할 항목 수 (옵셔널)
    search?: string; // 검색어 (옵셔널)
    order?: PAGINATION_ORDER; // 정렬 순서 (예: 'ASC', 'DESC') (옵셔널)
};
