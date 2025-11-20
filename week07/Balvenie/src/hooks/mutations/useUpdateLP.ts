import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateLP } from '../../apis/lp';
import { QUERY_KEY } from '../../key';

const useUpdateLP = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ lpId, formData }: { lpId: string; formData: FormData }) =>
            updateLP(lpId, formData),
        onSuccess: (_, variables) => {
            // LP 목록과 상세 정보 모두 무효화
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.lps, 'detail', variables.lpId],
            });
        },
    });
};

export default useUpdateLP;