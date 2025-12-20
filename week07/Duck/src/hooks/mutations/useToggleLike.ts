import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLike, deleteLike } from '../../apis/lp';
import { QUERY_KEY } from '../../constant/key';
import type { ResponseLPDetailDto, ResponseLPListDto, Likes } from '../../types/lp';
import useGetMyInfo from '../queries/useGetMyInfo';

const useToggleLike = () => {
    const queryClient = useQueryClient();
    const { data: myInfo } = useGetMyInfo();
    const userId = myInfo?.data?.id;

    return useMutation({
        mutationFn: ({ lpId, isLiked }: { lpId: string; isLiked: boolean }) => {
            // 좋아요 상태에 따라 POST 또는 DELETE 호출
            return isLiked ? deleteLike(lpId) : createLike(lpId);
        },
        // 낙관적 업데이트: 서버 응답을 기다리기 전에 즉시 UI 업데이트
        onMutate: async ({ lpId, isLiked }) => {
            if (!userId) {
                console.warn('userId가 없어서 좋아요 토글을 수행할 수 없습니다.');
                return;
            }

            console.log('좋아요 토글 시작 - lpId:', lpId, 'userId:', userId, '현재 isLiked:', isLiked);

            // 진행 중인 쿼리 취소
            await queryClient.cancelQueries({ queryKey: [QUERY_KEY.lp, 'detail', lpId] });
            await queryClient.cancelQueries({ queryKey: [QUERY_KEY.lps] });

            // 이전 데이터 백업
            const previousLpDetail = queryClient.getQueryData<ResponseLPDetailDto>([
                QUERY_KEY.lp,
                'detail',
                lpId,
            ]);
            // 모든 LP 목록 쿼리의 이전 데이터 백업
            const previousLpListQueries = queryClient.getQueriesData({
                queryKey: [QUERY_KEY.lps],
            });

            // LP 상세 정보 캐시 업데이트
            queryClient.setQueryData<ResponseLPDetailDto>(
                [QUERY_KEY.lp, 'detail', lpId],
                (old) => {
                    if (!old?.data) {
                        console.warn('LP 상세 데이터가 없습니다.');
                        return old;
                    }

                    const currentLikes = old.data.likes || [];
                    // variables에서 전달된 isLiked 상태 사용 (클릭 시점의 상태)
                    console.log('낙관적 업데이트 - 현재 isLiked:', isLiked, 'currentLikes:', currentLikes);

                    const newLikes: Likes[] = isLiked
                        ? currentLikes.filter((like) => like.userId !== userId)
                        : [
                              ...currentLikes,
                              {
                                  id: Date.now(), // 임시 ID
                                  userId: userId!,
                                  lpId: parseInt(lpId, 10),
                              },
                          ];

                    console.log('낙관적 업데이트 - 새로운 likes:', newLikes);

                    return {
                        ...old,
                        data: {
                            ...old.data,
                            likes: newLikes,
                        },
                    };
                }
            );

            // LP 목록 캐시 업데이트 (useInfiniteQuery의 경우)
            // useInfiniteQuery의 queryKey는 [QUERY_KEY.lps, 'infinite', search, order, limit] 형태
            // 모든 LP 목록 쿼리를 찾아서 업데이트
            const lpListQueries = queryClient.getQueriesData({
                queryKey: [QUERY_KEY.lps],
            });

            lpListQueries.forEach(([queryKey, queryData]: [any, any]) => {
                if (!queryData?.pages) return;

                queryClient.setQueryData(queryKey, (old: any) => {
                    if (!old?.pages) return old;

                    const updatedPages = old.pages.map((page: any) => {
                        if (!page?.data?.data) return page;

                        const updatedLps = page.data.data.map((lp: any) => {
                            if (lp.id.toString() !== lpId) return lp;

                            const currentLikes = lp.likes || [];
                            // variables에서 전달된 isLiked 상태 사용
                            const newLikes: Likes[] = isLiked
                                ? currentLikes.filter((like: Likes) => like.userId !== userId)
                                : [
                                      ...currentLikes,
                                      {
                                          id: Date.now(), // 임시 ID
                                          userId: userId!,
                                          lpId: lp.id,
                                      },
                                  ];

                            return {
                                ...lp,
                                likes: newLikes,
                            };
                        });

                        return {
                            ...page,
                            data: {
                                ...page.data,
                                data: updatedLps,
                            },
                        };
                    });

                    return {
                        ...old,
                        pages: updatedPages,
                    };
                });
            });

            // 롤백을 위한 이전 데이터 반환
            return { previousLpDetail, previousLpListQueries };
        },
        onSuccess: () => {
            // 낙관적 업데이트가 이미 적용되었으므로, 서버 응답 후에는 쿼리만 무효화
            // 실제 데이터는 서버에서 최신 상태를 가져오도록 함
            // 하지만 낙관적 업데이트를 유지하기 위해 refetch는 하지 않음
        },
        onError: (error: any, variables, context) => {
            // 에러 발생 시 이전 데이터로 롤백
            if (context?.previousLpDetail) {
                queryClient.setQueryData(
                    [QUERY_KEY.lp, 'detail', variables.lpId],
                    context.previousLpDetail
                );
            }
            // 모든 LP 목록 쿼리를 이전 상태로 롤백
            if (context?.previousLpListQueries) {
                context.previousLpListQueries.forEach(([queryKey, queryData]: [any, any]) => {
                    queryClient.setQueryData(queryKey, queryData);
                });
            }
            console.error('좋아요 토글 실패:', error);
        },
    });
};

export default useToggleLike;

