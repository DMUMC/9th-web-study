import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLP } from '../../apis/lp';
import { QUERY_KEY } from '../../constant/key';

const useCreateLP = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (formData: FormData) => createLP(formData),
        onSuccess: () => {
            // LP 목록 쿼리 무효화하여 자동 새로고침
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
        },
    });
};

export default useCreateLP;

