import { PAGINATION_ORDER } from '../enums/common.ts';

export type CommonResponse<T> = {
    status: boolean;
    statusCode: number;
    message: string;
    data: T;
};
// export type CursorBasedResponse<T> = {
//     status: boolean;
//     statusCode: number;
//     message: string;
//     data: T; // 실제 응답 데이터 (배열 형태가 될 수 있음)
//     nextCursor: number; // 다음 페이지 조회를 위한 커서 값
//     hasNext: boolean; // 다음 페이지가 있는지 여부
// };
export type CursorBasedResponse<T> = CommonResponse<T> & {
    data:T,
    nextCursor: number | null; // 다음 페이지 조회를 위한 커서 값
    hasNext: boolean; // 다음 페이지가 있는지 여부
};

export type PaginationDto = {
    cursor?: number; // 현재 페이지 시작 커서 (옵셔널)
    limit?: number; // 한 페이지에 표시할 항목 수 (옵셔널)
    search?: string; // 검색어 (옵셔널)
    order?: PAGINATION_ORDER; // 정렬 순서 (예: 'ASC', 'DESC') (옵셔널)
};
