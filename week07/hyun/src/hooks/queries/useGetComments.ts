import { useQuery } from '@tanstack/react-query';
import { getComments } from '../../apis/lp';
import type { Comment } from '../../types/lp';
import { useMemo } from 'react';

const useGetComments = (
    lpId: string | undefined,
    order: 'asc' | 'desc' = 'desc',
    limit: number = 10
) => {
    const { data: comments, isLoading, ...rest } = useQuery<Comment[]>({
        queryKey: ['lpComments', lpId, order, limit],
        queryFn: async () => {
            if (!lpId) {
                throw new Error('LP ID is required');
            }
            try {
                const response = await getComments(lpId, {
                    cursor: 0,
                    limit,
                    order,
                });
                // API 응답 구조 확인을 위한 로그
                console.log('댓글 API 응답:', response);
                
                // response.data가 배열인지 확인
                const commentsData = response?.data;
                console.log('댓글 데이터:', commentsData, '배열 여부:', Array.isArray(commentsData));
                
                if (Array.isArray(commentsData)) {
                    return commentsData;
                }
                // 만약 response 자체가 배열이면
                if (Array.isArray(response)) {
                    return response;
                }
                return [];
            } catch (error) {
                // API 에러 발생 시 빈 배열 반환
                console.error('댓글 조회 실패:', error);
                return [];
            }
        },
        enabled: !!lpId,
        staleTime: 0, // 즉시 stale로 처리하여 무효화 시 바로 refetch
        gcTime: 5 * 60 * 1000, // 5분
        retry: false, // 404 에러 시 재시도하지 않음
        refetchOnMount: true, // 마운트 시 항상 refetch
    });

    // 디버깅을 위한 로그
    console.log('useGetComments 반환값:', {
        comments,
        isLoading,
        commentsType: typeof comments,
        isArray: Array.isArray(comments),
        length: comments?.length,
    });

    return {
        data: Array.isArray(comments) ? comments : [],
        isLoading,
        ...rest,
    };
};

export default useGetComments;

