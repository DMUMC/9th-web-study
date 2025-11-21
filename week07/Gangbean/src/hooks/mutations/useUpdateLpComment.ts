import {
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';
import { QUERY_KEY } from '../../constants/key';
import { updateLpComment } from '../../apis/comment';
import type { RequestUpdateLpCommentDto } from '../../types/comment';

function useUpdateLpComment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (body: RequestUpdateLpCommentDto) =>
            updateLpComment(body),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.lpComments],
            });
        },
    });
}

export default useUpdateLpComment;



