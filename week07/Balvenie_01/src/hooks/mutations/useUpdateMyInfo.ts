import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMyInfo } from '../../apis/auth';

interface UpdateMyInfoPayload {
    name: string;
    bio?: string;
    avatar?: string;
}

const useUpdateMyInfo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (body: UpdateMyInfoPayload) => updateMyInfo(body),
        onSuccess: () => {
            // 내 정보 쿼리 무효화
            queryClient.invalidateQueries({ queryKey: ['myInfo'] });
        },
        onError: (error: any) => {
            // 404 에러는 백엔드 API가 아직 구현되지 않았을 수 있음
            if (error?.response?.status === 404) {
                console.warn('프로필 수정 API가 아직 구현되지 않았습니다.');
            }
        },
    });
};

export default useUpdateMyInfo;