import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postLogout } from '../../apis/auth';
import { QUERY_KEY } from '../../constants/key';

function useLogout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => postLogout(),
        onSuccess: () => {
            // 모든 쿼리 제거
            queryClient.removeQueries();
        },
    });
}

export default useLogout;

