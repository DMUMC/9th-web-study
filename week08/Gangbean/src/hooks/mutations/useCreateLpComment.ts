import {
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';
import { QUERY_KEY } from '../../constants/key';
import { postLpComment } from '../../apis/comment';
import type { RequestCreateLpCommentDto } from '../../types/comment';

function useCreateLpComment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (body: RequestCreateLpCommentDto) =>
            postLpComment(body),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.lpComments],
            });
        },
    });
}

export default useCreateLpComment;
