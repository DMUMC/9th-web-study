import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLP } from '../../apis/lp';
import { QUERY_KEY } from '../../constant/key';

interface CreateLPPayload {
    title: string;
    content: string;
    thumbnail?: string;
    tags?: string[];
    published?: boolean;
}

const useCreateLP = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (body: CreateLPPayload) => createLP(body),
        onSuccess: () => {
            // LP 목록 쿼리 무효화하여 자동 새로고침
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
        },
    });
};

export default useCreateLP;

