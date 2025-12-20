import {
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';
import { updateMyInfo } from '../../apis/auth';
import type { RequestUpdateMyInfoDto } from '../../types/user';
import { QUERY_KEY } from '../../constants/key';
import type { ResponseMyInfoDto } from '../../types/user';

function useUpdateMyInfo() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (body: RequestUpdateMyInfoDto) =>
            updateMyInfo(body),
        onMutate: async (newData) => {
            // 진행 중인 쿼리 취소
            await queryClient.cancelQueries({
                queryKey: [QUERY_KEY.myInfo],
            });

            // 이전 데이터 스냅샷 저장 (롤백용)
            const previousData = queryClient.getQueryData<
                ResponseMyInfoDto['data']
            >([QUERY_KEY.myInfo]);

            // 낙관적 업데이트: 쿼리 캐시를 즉시 업데이트
            if (previousData) {
                queryClient.setQueryData<ResponseMyInfoDto['data']>(
                    [QUERY_KEY.myInfo],
                    {
                        ...previousData,
                        name: newData.name ?? previousData.name,
                        bio: newData.bio ?? previousData.bio,
                        avatar: newData.avatar ?? previousData.avatar,
                        updatedAt: new Date(),
                    }
                );
            }

            // 롤백을 위해 이전 데이터 반환
            return { previousData };
        },
        onError: (error, newData, context) => {
            // 에러 발생 시 이전 데이터로 롤백
            if (context?.previousData) {
                queryClient.setQueryData<ResponseMyInfoDto['data']>(
                    [QUERY_KEY.myInfo],
                    context.previousData
                );
            }
            console.error('정보 업데이트 실패:', error);
        },
        onSuccess: () => {
            // 성공 시 서버 데이터로 최종 동기화
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.myInfo],
            });
        },
    });
}

export default useUpdateMyInfo;
