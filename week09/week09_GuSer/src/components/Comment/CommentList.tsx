import { useInfiniteQuery } from '@tanstack/react-query';
import { getComments } from '../../apis/comment';
import CommentItem from './CommentItem';
import CommentSkeleton from '../Skeleton/CommentSkeleton';
import { useState } from 'react';

interface CommentListProps {
  lpId: number;
}

const CommentList = ({ lpId }: CommentListProps) => {
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['lpComments', lpId, order],
    queryFn: ({ pageParam }) => getComments(lpId, pageParam, order),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const comments = data?.pages.flatMap((page) => page.comments) ?? [];

  if (isLoading) {
    return <CommentSkeleton />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">댓글 ({comments.length})</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setOrder('desc')}
            className={`px-4 py-2 rounded-md transition-colors ${
              order === 'desc'
                ? 'bg-pink-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            최신순
          </button>
          <button
            onClick={() => setOrder('asc')}
            className={`px-4 py-2 rounded-md transition-colors ${
              order === 'asc'
                ? 'bg-pink-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            오래된순
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} lpId={lpId} />
        ))}
      </div>

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors disabled:opacity-50"
        >
          {isFetchingNextPage ? '로딩 중...' : '더 보기'}
        </button>
      )}

      {comments.length === 0 && (
        <p className="text-center text-gray-400 py-8">댓글이 없습니다.</p>
      )}
    </div>
  );
};

export default CommentList;

