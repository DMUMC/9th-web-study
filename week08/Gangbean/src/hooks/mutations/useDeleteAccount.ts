import {
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';
import { QUERY_KEY } from '../../constants/key';
import { deleteAccount } from '../../apis/auth';

function useDeleteAccount() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => deleteAccount(),
        onSuccess: () => {
            // 모든 쿼리 제거
            queryClient.removeQueries();
        },
    });
}

export default useDeleteAccount;
