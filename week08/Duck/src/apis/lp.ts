// src/apis/lp.ts

import type { PaginationDto } from '../types/common'; // 요청 파라미터 타입 임포트
import type { ResponseLPDetailDto, ResponseLPListDto, Comment } from '../types/lp'; // 응답 데이터 타입 임포트
import { axiosInstance } from './axios'; // axios 인스턴스 임포트 (경로에 맞게 수정 필요)

/**
 * LP(Long Play) 목록을 조회하는 API 요청 함수
 * @param paginationDto 쿼리 파라미터 (cursor, limit, search, order)
 * @returns ResponseLPListDto 타입의 응답을 반환하는 Promise
 */
export const getLPList = async (
    paginationDto: PaginationDto
): Promise<ResponseLPListDto> => {
    // API 요청 및 데이터 구조 분해
    const { data } = await axiosInstance.get('/v1/lps', {
        // 쿼리 파라미터(params)로 DTO를 전달하여 GET 요청에 포함
        params: paginationDto,
    });

    // 실제 응답 데이터 (data.data가 아닌 data 그 자체)를 반환
    return data;
};

export const getLPDetail = async (lpId: string): Promise<ResponseLPDetailDto> => {
    const { data } = await axiosInstance.get(`/v1/lps/${lpId}`);
    return data;
};

export const createComment = async (
    lpId: string,
    content: string
): Promise<{ data: { id: number; content: string } }> => {
    const { data } = await axiosInstance.post(`/v1/lps/${lpId}/comments`, {
        content,
    });
    return data;
};

export const getComments = async (
    lpId: string,
    params?: {
        cursor?: number;
        limit?: number;
        order?: 'asc' | 'desc';
    }
): Promise<{ data: Comment[] }> => {
    const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`, {
        params: {
            cursor: params?.cursor ?? 0,
            limit: params?.limit ?? 10,
            order: params?.order ?? 'asc',
        },
    });
    
    // API 응답 구조: CursorBasedResponse<Comment[]>
    // { status, statusCode, message, data: { data: Comment[], nextCursor, hasNext } }
    
    // data.data.data가 배열인지 확인 (CursorBasedResponse 형식)
    if (data?.data?.data && Array.isArray(data.data.data)) {
        return { data: data.data.data };
    }
    
    // data.data가 배열인지 확인 (일반 CommonResponse 형식)
    if (data?.data && Array.isArray(data.data)) {
        return { data: data.data };
    }
    
    // data가 배열이면 직접 배열 반환
    if (Array.isArray(data)) {
        return { data };
    }
    
    // data.data가 객체이면 빈 배열 반환 (댓글이 없는 경우)
    if (data?.data && typeof data.data === 'object' && !Array.isArray(data.data)) {
        return { data: [] };
    }
    
    // 기본값: 빈 배열 반환
    return { data: [] };
};

export const createLP = async (body: {
    title: string;
    content: string;
    thumbnail?: string;
    tags?: string[];
    published?: boolean;
}): Promise<ResponseLPDetailDto> => {
    const { data } = await axiosInstance.post('/v1/lps', body);
    return data;
};

export const updateLP = async (
    lpId: string,
    formData: FormData
): Promise<ResponseLPDetailDto> => {
    const { data } = await axiosInstance.put(`/v1/lps/${lpId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return data;
};

export const deleteLP = async (lpId: string): Promise<void> => {
    await axiosInstance.delete(`/v1/lps/${lpId}`);
};

export const updateComment = async (
    lpId: string,
    commentId: number,
    content: string
): Promise<{ data: Comment }> => {
    const { data } = await axiosInstance.put(
        `/v1/lps/${lpId}/comments/${commentId}`,
        { content }
    );
    return data;
};

export const deleteComment = async (
    lpId: string,
    commentId: number
): Promise<void> => {
    await axiosInstance.delete(`/v1/lps/${lpId}/comments/${commentId}`);
};

export const createLike = async (
    lpId: string
): Promise<{ data: { liked: boolean; likesCount: number } }> => {
    const { data } = await axiosInstance.post(`/v1/lps/${lpId}/likes`);
    return data;
};

export const deleteLike = async (
    lpId: string
): Promise<{ data: { liked: boolean; likesCount: number } }> => {
    const { data } = await axiosInstance.delete(`/v1/lps/${lpId}/likes`);
    return data;
};
