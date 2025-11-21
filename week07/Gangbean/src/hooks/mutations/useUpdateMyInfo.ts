import {
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';
import { updateMyInfo } from '../../apis/auth';
import type { RequestUpdateMyInfoDto } from '../../types/user';
import { QUERY_KEY } from '../../constants/key';

function useUpdateMyInfo() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (body: RequestUpdateMyInfoDto) =>
            updateMyInfo(body),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.myInfo],
            });
        },
    });
}

export default useUpdateMyInfo;
