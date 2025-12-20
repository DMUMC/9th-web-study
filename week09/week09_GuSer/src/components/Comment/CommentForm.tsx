import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createComment } from '../../apis/comment';

interface CommentFormProps {
  lpId: number;
}

const CommentForm = ({ lpId }: CommentFormProps) => {
  const [content, setContent] = useState('');
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (content: string) => createComment(lpId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lpComments', lpId] });
      setContent('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      createMutation.mutate(content);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="댓글을 입력하세요..."
        className="w-full bg-gray-800 text-white rounded-md p-4 resize-none focus:outline-none focus:ring-2 focus:ring-pink-600"
        rows={4}
      />
      <button
        type="submit"
        disabled={!content.trim() || createMutation.isPending}
        className="px-6 py-2 bg-pink-600 hover:bg-pink-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {createMutation.isPending ? '작성 중...' : '댓글 작성'}
      </button>
    </form>
  );
};

export default CommentForm;

