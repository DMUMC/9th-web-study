import type { CommonResponse, CursorBasedResponse } from './common';

// --- 서브(Sub) 데이터 타입 정의 ---

/**
 * 태그(Tags) 데이터 구조
 */
export type Tag = {
    id: number;
    name: string;
};

/**
 * 좋아요(Likes) 데이터 구조
 */
export type Likes = {
    id: number;
    userId: number;
    lpId: number;
};

/**
 * 댓글(Comment) 데이터 구조
 */
export type Comment = {
    id: number;
    content: string;
    userId: number;
    lpId: number;
    createdAt: string | Date;
    updatedAt: string | Date;
};

export type Lp = {
    id: number;
    title: string;
    content: string;
    thumbnail: string;
    published: boolean;
    authorId: number;
    createdAt: string | Date;
    updatedAt: string | Date;
    tags: Tag[]; // 정의된 Tag 타입의 배열
    likes: Likes[];
    comments?: Comment[]; // 댓글 배열
};

// --- 메인 응답 타입 정의 ---

/**
 * LP 목록 조회 API의 응답 데이터 구조 (CursorBasedResponse를 확장함)
 */
export type ResponseLPListDto = CursorBasedResponse<Lp[]>;
export type ResponseLPDetailDto = CommonResponse<Lp>;
