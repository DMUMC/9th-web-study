import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMyInfo } from '../../apis/auth';
import type { ResponseMyInfoDto } from '../../types/auth';

interface UpdateMyInfoPayload {
    name: string;
    bio?: string;
    avatar?: string;
}

const useUpdateMyInfo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (body: UpdateMyInfoPayload) => updateMyInfo(body),
        // 낙관적 업데이트: 서버 응답을 기다리기 전에 즉시 UI 업데이트
        onMutate: async (newData) => {
            // 진행 중인 쿼리 취소
            await queryClient.cancelQueries({ queryKey: ['myInfo'] });

            // 이전 데이터 백업
            const previousData = queryClient.getQueryData<ResponseMyInfoDto>(['myInfo']);

            // 캐시를 즉시 업데이트 (Navbar와 MyPage 모두 반영됨)
            queryClient.setQueryData<ResponseMyInfoDto>(['myInfo'], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    data: {
                        ...old.data,
                        name: newData.name,
                        bio: newData.bio ?? old.data.bio,
                        avatar: newData.avatar ?? old.data.avatar,
                    },
                };
            });

            // 롤백을 위한 이전 데이터 반환
            return { previousData };
        },
        onSuccess: () => {
            // 성공 시 쿼리 무효화하여 최신 데이터 가져오기
            queryClient.invalidateQueries({ queryKey: ['myInfo'] });
        },
        onError: (error: any, variables, context) => {
            // 에러 발생 시 이전 데이터로 롤백
            if (context?.previousData) {
                queryClient.setQueryData(['myInfo'], context.previousData);
            }
            // 404 에러는 백엔드 API가 아직 구현되지 않았을 수 있음
            if (error?.response?.status === 404) {
                console.warn('프로필 수정 API가 아직 구현되지 않았습니다.');
            }
        },
    });
};

export default useUpdateMyInfo;