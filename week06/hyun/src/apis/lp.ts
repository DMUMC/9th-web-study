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
    lpId: string
): Promise<{ data: Comment[] }> => {
    const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`);
    return data;
};
