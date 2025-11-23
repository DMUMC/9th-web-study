import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateComment } from '../../apis/lp';
import { QUERY_KEY } from '../../constant/key';

const useUpdateComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            lpId,
            commentId,
            content,
        }: {
            lpId: string;
            commentId: number;
            content: string;
        }) => updateComment(lpId, commentId, content),
        onSuccess: (_, variables) => {
            // 댓글 목록 쿼리 무효화 (모든 정렬 순서 포함)
            queryClient.invalidateQueries({
                queryKey: ['lpComments', variables.lpId],
            });
            // LP 상세 정보도 무효화하여 댓글 수 업데이트
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.lp, 'detail', variables.lpId],
            });
        },
    });
};

export default useUpdateComment;

