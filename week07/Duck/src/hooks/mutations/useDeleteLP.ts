import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteLP } from '../../apis/lp';
import { QUERY_KEY } from '../../constant/key';

const useDeleteLP = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (lpId: string) => deleteLP(lpId),
        onSuccess: () => {
            // LP 목록 무효화
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
        },
    });
};

export default useDeleteLP;

