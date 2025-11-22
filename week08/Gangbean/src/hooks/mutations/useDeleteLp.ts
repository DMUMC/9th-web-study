import {
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';
import { QUERY_KEY } from '../../constants/key';
import { deleteLp } from '../../apis/lp';

function useDeleteLp() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (lpId: number) => deleteLp(lpId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.lps],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.lpDetail],
            });
        },
    });
}

export default useDeleteLp;
