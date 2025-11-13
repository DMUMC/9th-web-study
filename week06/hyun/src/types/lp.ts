import type { CursorBasedResponse } from './common';

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

export type Lp = {
    id: number;
        title: string;
        content: string;
        thumbnail: string;
        published: boolean;
        authorId: number;
        createdAt: Date;
        updatedAt: Date;
        tags: Tag[]; // 정의된 Tag 타입의 배열
        likes: Likes[];
}

// --- 메인 응답 타입 정의 ---

/**
 * LP 목록 조회 API의 응답 데이터 구조 (CursorBasedResponse를 확장함)
 */
export type ResponseLPListDto = CursorBasedResponse<Lp[]>;
