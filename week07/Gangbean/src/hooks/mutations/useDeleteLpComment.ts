import {
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';
import { QUERY_KEY } from '../../constants/key';
import { deleteLpComment } from '../../apis/comment';

function useDeleteLpComment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            lpId,
            commentId,
        }: {
            lpId: number;
            commentId: number;
        }) => deleteLpComment(lpId, commentId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.lpComments],
            });
        },
    });
}

export default useDeleteLpComment;

