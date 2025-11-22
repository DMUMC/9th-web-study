import {
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';
import { patchUpdateLp } from '../../apis/lp';
import { QUERY_KEY } from '../../constants/key';
import type { RequestUpdateLpDto } from '../../types/lp';

function useUpdateLp() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            lpId,
            body,
        }: {
            lpId: number;
            body: RequestUpdateLpDto;
        }) => patchUpdateLp(lpId, body),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.lps],
            });
            queryClient.invalidateQueries({
                queryKey: [
                    QUERY_KEY.lpDetail,
                    variables.lpId,
                ],
            });
        },
    });
}

export default useUpdateLp;
