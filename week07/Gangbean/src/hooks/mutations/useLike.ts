import {
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';
import { postLike } from '../../apis/lp';
import { QUERY_KEY } from '../../constants/key';
import type { ResponseLpDetailDto } from '../../types/lp';

function useLike() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            lpId,
            userId,
        }: {
            lpId: number;
            userId: number;
        }) => postLike(lpId),
        onMutate: async ({ lpId, userId }) => {
            // 진행 중인 쿼리 취소
            await queryClient.cancelQueries({
                queryKey: [QUERY_KEY.lpDetail, lpId],
            });

            // 이전 데이터 스냅샷 저장
            const previousData = queryClient.getQueryData<
                ResponseLpDetailDto['data']
            >([QUERY_KEY.lpDetail, lpId]);

            // 낙관적 업데이트: 좋아요 추가
            if (previousData) {
                queryClient.setQueryData<
                    ResponseLpDetailDto['data']
                >([QUERY_KEY.lpDetail, lpId], {
                    ...previousData,
                    likes: [
                        ...(previousData.likes || []),
                        {
                            id: Date.now(), // 임시 ID
                            userId: userId,
                            lpId: lpId,
                        },
                    ],
                });
            }

            return { previousData };
        },
        onError: (error, variables, context) => {
            // 에러 발생 시 롤백
            if (context?.previousData) {
                queryClient.setQueryData<
                    ResponseLpDetailDto['data']
                >(
                    [QUERY_KEY.lpDetail, variables.lpId],
                    context.previousData
                );
            }
            console.error('좋아요 추가 실패:', error);
        },
        onSuccess: (_, variables) => {
            // 성공 시 서버 데이터로 최종 동기화
            queryClient.invalidateQueries({
                queryKey: [
                    QUERY_KEY.lpDetail,
                    variables.lpId,
                ],
            });
        },
    });
}

export default useLike;
